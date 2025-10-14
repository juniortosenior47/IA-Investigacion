import spacy
from typing import Set

# Cargar modelo de spaCy en el módulo para reutilización
nlp = spacy.load("en_core_web_sm")

def correct_sentence(sentence: str) -> str:
    """
    Corrige frases en inglés detectando artículos sobrantes o faltantes
    en estructuras típicas como 'is study of' o 'the morphology'.
    """
    doc = nlp(sentence)
    tokens = [t.text for t in doc]

    corrected = []

    for i, token in enumerate(doc):
        # 🔹 Eliminar "the" antes de nombres académicos abstractos (como morphology)
        if token.lower_ == "the" and i + 1 < len(doc):
            next_token = doc[i + 1]
            if next_token.pos_ == "NOUN" and next_token.text.endswith("logy"):
                continue  # elimina el 'the' innecesario

        # 🔹 Insertar "the" antes de "study" si está mal usado
        if token.text.lower() == "study" and i > 0 and doc[i - 1].text.lower() == "is":
            corrected.append("the")

        # 🔹 Evitar duplicados (ej: "the the", "is is")
        if i > 0 and token.text.lower() == doc[i - 1].text.lower():
            continue

        corrected.append(token.text)

    # Unir y limpiar espacios/puntuación
    corrected_sentence = " ".join(corrected)
    corrected_sentence = corrected_sentence.replace(" ,", ",").replace(" .", ".")
    corrected_sentence = corrected_sentence[0].upper() + corrected_sentence[1:]

    return corrected_sentence