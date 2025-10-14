def sort_and_translate(lista_traducciones: dict, orden: list) -> tuple[dict, str]:
    """
    Ordena un diccionario de traducciones según el orden dado en una lista
    y devuelve tanto el diccionario ordenado como la frase traducida.

    Args:
        lista_traducciones (dict): Diccionario con clave = palabra original y valor = traducción.
        orden (list): Lista que define el orden de las palabras.

    Returns:
        tuple[dict, str]: (diccionario ordenado, frase traducida)
    """

    # ✅ 1. Extraer el diccionario de traducciones (por si viene dentro de otra clave)
    ##traducciones = lista_traducciones.get("translations", lista_traducciones)
    traducciones = {k: v for k, v in zip(orden, lista_traducciones)}
    # ✅ 2. Ordenar el diccionario según la lista de orden
    diccionario_ordenado = {
        palabra: traducciones[palabra]
        for palabra in orden
        if palabra in traducciones
    }

    # ✅ 3. Crear la lista ordenada de las traducciones
    traduccion_ordenada = [
        traducciones[palabra] if traducciones[palabra] is not None else "No encontrado"
        for palabra in orden
        if palabra in traducciones
    ]

    # ✅ 4. Construir la frase traducida
    frase = ""
    for palabra in traduccion_ordenada:
        if palabra in [",", ".", "?", "!", ";", ":"]:
            frase = frase.rstrip() + palabra  # sin espacio antes de signos
        else:
            frase += palabra + " "
    frase = frase.strip()

    return diccionario_ordenado, frase