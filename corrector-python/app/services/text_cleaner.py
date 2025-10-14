import spacy
from typing import Set

# Cargar modelo de spaCy en el módulo para reutilización
nlp = spacy.load("en_core_web_sm")

def clean_sentence(sentence: str) -> str:
    """Elimina artículos innecesarios como 'the', 'a', 'an' antes de sustantivos plurales.

    Reglas actuales (simples):
    - Si un determinante (DET) es 'the'/'a'/'an' y el siguiente token es NOUN plural (NNS),
      se elimina el determinante.
    - Mantiene la puntuación y limpia espacios sobrantes.
    """
    doc = nlp(sentence)
    words = [token.text for token in doc]
    indices_to_remove: Set[int] = set()

    for i, token in enumerate(doc):
        if token.pos_ == "DET" and token.text.lower() in {"the", "a", "an"}:
            if i + 1 < len(doc):
                next_token = doc[i + 1]
                # Sustantivo plural
                if next_token.pos_ == "NOUN" and next_token.tag_ == "NNS":
                    indices_to_remove.add(i)

    cleaned = " ".join(
        [w for i, w in enumerate(words) if i not in indices_to_remove]
    )
    # Arreglar espacios antes de signos de puntuación comunes
    cleaned = cleaned.replace(" ,", ",").replace(" .", ".").replace(" ;", ";").strip()
    return cleaned
