from app.domain.services.ordenar import sort_and_translate

def test_sort_and_translate_basic():
    translations = ["hello", "dog", "sky"]
    order = ["hola", "perro", "cielo"]
    expected_dict = {"hola": "hello", "perro": "dog", "cielo": "sky"}
    expected_phrase = "hello dog sky"
    
    dicc_ordenado, frase_final = sort_and_translate(translations, order)
    
    assert dicc_ordenado == expected_dict
    assert frase_final == expected_phrase

def test_sort_and_translate_with_punctuation():
    translations = ["hello", ",", "dog", "."]
    order = ["hola", ",", "perro", "."]
    expected_dict = {"hola": "hello", ",": ",", "perro": "dog", ".": "."}
    expected_phrase = "hello, dog."

    dicc_ordenado, frase_final = sort_and_translate(translations, order)
    
    assert dicc_ordenado == expected_dict
    assert frase_final == expected_phrase

def test_sort_and_translate_empty_lists():
    translations = []
    order = []
    expected_dict = {}
    expected_phrase = ""

    dicc_ordenado, frase_final = sort_and_translate(translations, order)

    assert dicc_ordenado == expected_dict
    assert frase_final == expected_phrase

def test_sort_and_translate_missing_words():
    translations = ["hello", "sky"]
    order = ["hola", "gato", "cielo"]
    expected_dict = {"hola": "hello", "cielo": "sky"}
    expected_phrase = "hello sky"

    dicc_ordenado, frase_final = sort_and_translate(translations, order)

    assert dicc_ordenado == expected_dict
    assert frase_final == expected_phrase
