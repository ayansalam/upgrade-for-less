from google import genai

api_key = "AIzaSyApUfmixzHLABAl6qEgD_NuY210IKO3UXU"
client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[{"parts": [{"text": "Explain how AI works in a few words"}]}]
)

print(response.text)