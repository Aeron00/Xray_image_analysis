import numpy as np
import cv2
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
import torchxrayvision as xrv
import google.generativeai as genai
import os
    
def analyse_image(image, weights='densenet121-res224-all', cuda=False, feats=False, resize=False):
    
    image_array = np.frombuffer(image, dtype=np.uint8)
    opencv_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2RGB)
    
    img = xrv.datasets.normalize(img, 255)

    if len(img.shape) > 2:
        img = img[:, :, 0]
    if len(img.shape) < 2:
        return {"Error: Image dimension lower than 2"}

    img = img[None, :, :]


    if resize:
        transform = transforms.Compose([xrv.datasets.XRayCenterCrop(), xrv.datasets.XRayResizer(224)])
    else:
        transform = transforms.Compose([xrv.datasets.XRayCenterCrop()])

    img = transform(img)

    model = xrv.models.get_model(weights)

    output = {}
    with torch.no_grad():
        img = torch.from_numpy(img).unsqueeze(0)
        if cuda:
            img = img.cuda()
            model = model.cuda()

        if feats:
            feats = model.features(img)
            feats = F.relu(feats, inplace=True)
            feats = F.adaptive_avg_pool2d(feats, (1, 1))
            output["feats"] = list(feats.cpu().detach().numpy().reshape(-1))

        preds = model(img).cpu()
        output["preds"] = dict(zip(xrv.datasets.default_pathologies, preds[0].detach().numpy()))

    if output:
        genai.configure(api_key='AIzaSyAsj8dmGJOFZiad6ILMPorOmM86l4mCRFs')
        model = genai.GenerativeModel('gemini-pro')

        response = model.generate_content(f"Given the following output dictionary representing predicted pathologies and their probabilities from an X-ray image analysis: {output['preds']}, Please generate a user-friendly response that explains the implications of these findings for the X-ray image in one paragraph. Aim to provide a clear interpretation of the detected pathologies and their significance in a way that is easy for a non-expert to understand. The goal is to simplify the technical information and convey the potential abnormalities identified by the model.")
        # print(response.text) # 6 API calls
    return {'output_dict' : output['preds'],'explaination' : response.text}
