import os, requests, time
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
print("Using BASE_URL =", BASE_URL)

data = [
    {"word": "gato", "translation": "cat"},
    {"word": "árbol", "translation": "tree"},
    {"word": "cielo", "translation": "sky"}
]
print("Adding words...")
r = requests.post(f"{BASE_URL}/add_words", json=data)
print("Add response:", r.status_code, r.json())

time.sleep(0.5)
print("Translate single 'gato'")
r = requests.get(f"{BASE_URL}/translate", params={"word": "gato"})
print(r.json())

print("Translate many ['gato','perro','cielo']")
r = requests.post(f"{BASE_URL}/translate_many", json=['gato','perro','cielo'])
print(r.json())
