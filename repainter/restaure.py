#https://stackoverflow.com/questions/67196395/send-and-receive-back-image-by-post-method-in-python-flask
from __future__ import print_function
import cv2
import base64
import numpy as np


#convert base64 to opencv IMREAD
def base64ToCv(uri,method):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, method)
   return img


#convert cv to base64
def cv2ToBase64(imgCv):
    _, im_arr = cv2.imencode('.png', imgCv)  # im_arr: image in Numpy one-dim array format.
    return base64.b64encode(im_arr).decode('utf-8')
  

#generate the inpaint and return the base64 img processed
def res(img, mask):
    #get de base64 and convert it 
    _img = base64ToCv(img, cv2.IMREAD_COLOR)
    _mask =base64ToCv(mask, 0)
    
    #Invert mask
    mask_inv = cv2.bitwise_not(_mask)
    
    restored1 = _img.copy()

    # generate the inpaint 
    cv2.xphoto.inpaint(_img, mask_inv,restored1, cv2.xphoto.INPAINT_FSR_BEST)
    #return converted base64 image
    return cv2ToBase64(restored1)

