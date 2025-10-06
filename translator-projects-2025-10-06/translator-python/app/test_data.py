import requests

BASE_URL = "http://localhost:8000"

# 1. Agregar palabras
print("Agregando palabras...")
data = [
    {"word": "gato", "translation": "cat"},
    {"word": "árbol", "translation": "tree"},
    {"word": "cielo", "translation": "sky"}
]
r = requests.post(f"{BASE_URL}/add_words", json=data)
print("Add:", r.status_code, r.json())

# 2. Traducir una palabra
r = requests.get(f"{BASE_URL}/translate", params={"word": "gato"})
print("Translate single:", r.json())

# 3. Traducir muchas palabras
words = ["gato", "perro", "cielo"]
r = requests.post(f"{BASE_URL}/translate_many", json=words)
print("Translate many:", r.json())
