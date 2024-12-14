from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from diffusers import StableDiffusionPipeline
import io
import base64
from pyngrok import ngrok  

app = Flask(__name__)

CORS(app, resources={r"/generate-image": {"origins": "*"}})

class CFG:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    seed = 42
    torch.manual_seed(seed)
    image_gen_steps = 35
    image_gen_model_id = "stabilityai/stable-diffusion-2"
    image_gen_size = (400, 400)
    image_gen_guidance_scale = 9


if CFG.device == "cuda":
    CFG.image_gen_model = StableDiffusionPipeline.from_pretrained(
        CFG.image_gen_model_id,
        torch_dtype=torch.float16,
        revision="fp16",
        force_download=True 
    )
else:
    CFG.image_gen_model = StableDiffusionPipeline.from_pretrained(
        CFG.image_gen_model_id,
        force_download=True 
    )

CFG.image_gen_model = CFG.image_gen_model.to(CFG.device)

def generate_image(prompt, model):
    image = model(
        prompt,
        num_inference_steps=CFG.image_gen_steps,
        guidance_scale=CFG.image_gen_guidance_scale,
    ).images[0]
    image = image.resize(CFG.image_gen_size)
    return image

@app.route('/generate-image', methods=['POST'])
def generate_image_endpoint():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        image = generate_image(prompt, CFG.image_gen_model)
        
        img_io = io.BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

        return jsonify({'image': img_base64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


public_url = ngrok.connect(5000) 
print(f" * ngrok tunnel \"{public_url}\" -> http://127.0.0.1:5000")


if __name__ == "__main__":
    app.run()
