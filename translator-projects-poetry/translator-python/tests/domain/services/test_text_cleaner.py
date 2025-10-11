import spacy
import pytest
from app.domain.services.text_cleaner import clean_sentence

# Mock spacy.load to avoid loading the model during tests
@pytest.fixture(scope="module")
def mock_nlp():
    class MockToken:
        def __init__(self, text, pos, tag):
            self.text = text
            self.pos_ = pos
            self.tag_ = tag

    class MockDoc:
        def __init__(self, tokens_data):
            self.tokens = [MockToken(t[0], t[1], t[2]) for t in tokens_data]

        def __getitem__(self, i):
            return self.tokens[i]

        def __len__(self):
            return len(self.tokens)

    def mock_nlp_load(model_name):
        # A very basic mock, only enough to satisfy the clean_sentence logic
        def _nlp(text):
            # This needs to be smarter for more complex tests
            if text == "the dogs run":
                return MockDoc([
                    ("the", "DET", "DT"),
                    ("dogs", "NOUN", "NNS"),
                    ("run", "VERB", "VB")
                ])
            elif text == "a cats sleep":
                return MockDoc([
                    ("a", "DET", "DT"),
                    ("cats", "NOUN", "NNS"),
                    ("sleep", "VERB", "VB")
                ])
            elif text == "an apples are red":
                return MockDoc([
                    ("an", "DET", "DT"),
                    ("apples", "NOUN", "NNS"),
                    ("are", "AUX", "VBP"),
                    ("red", "ADJ", "JJ")
                ])
            elif text == "the car is fast":
                return MockDoc([
                    ("the", "DET", "DT"),
                    ("car", "NOUN", "NN"),
                    ("is", "AUX", "VBZ"),
                    ("fast", "ADJ", "JJ")
                ])
            elif text == "dogs run":
                return MockDoc([
                    ("dogs", "NOUN", "NNS"),
                    ("run", "VERB", "VB")
                ])
            elif text == "The quick brown fox jumps over the lazy dog.":
                return MockDoc([
                    ("The", "DET", "DT"), ("quick", "ADJ", "JJ"), ("brown", "ADJ", "JJ"),
                    ("fox", "NOUN", "NN"), ("jumps", "VERB", "VBZ"), ("over", "ADP", "IN"),
                    ("the", "DET", "DT"), ("lazy", "ADJ", "JJ"), ("dog", "NOUN", "NN"), (".", "PUNCT", ".")
                ])
            return MockDoc([(t, "X", "X") for t in text.split()]) # Default for unmocked sentences
        return _nlp

    yield mock_nlp_load

@pytest.fixture(autouse=True)
def mock_spacy_load(monkeypatch, mock_nlp):
    monkeypatch.setattr(spacy, "load", mock_nlp)

def test_clean_sentence_removes_articles_before_plural_nouns():
    sentence = "the dogs run"
    cleaned = clean_sentence(sentence)
    assert cleaned == "dogs run"

def test_clean_sentence_keeps_articles_before_singular_nouns():
    sentence = "the car is fast"
    cleaned = clean_sentence(sentence)
    assert cleaned == "the car is fast"

def test_clean_sentence_handles_multiple_articles():
    sentence = "a cats sleep and the dogs run"
    cleaned = clean_sentence(sentence)
    assert cleaned == "cats sleep and dogs run"

def test_clean_sentence_no_change_if_no_plural_nouns_after_article():
    sentence = "An apple is red"
    cleaned = clean_sentence(sentence)
    assert cleaned == "An apple is red"

def test_clean_sentence_punctuation_and_spacing():
    sentence = "The quick brown fox jumps over the lazy dog ."
    cleaned = clean_sentence(sentence)
    assert cleaned == "The quick brown fox jumps over the lazy dog."

def test_clean_sentence_empty_string():
    sentence = ""
    cleaned = clean_sentence(sentence)
    assert cleaned == ""

def test_clean_sentence_only_articles():
    sentence = "the a an"
    cleaned = clean_sentence(sentence)
    assert cleaned == "the a an"

def test_clean_sentence_an_before_plural():
    sentence = "an apples are red"
    cleaned = clean_sentence(sentence)
    assert cleaned == "apples are red"
