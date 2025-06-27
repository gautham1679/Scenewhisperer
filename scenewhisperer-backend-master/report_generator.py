from transformers import pipeline
generator = pipeline("text-generation", model="tiiuae/falcon-rw-1b")

def generate_report(input_text):
    prompt = f"Generate a short emergency incident report from: {input_text}"
    output = generator(prompt, max_new_tokens=100)
    return output[0]['generated_text']
