import PySimpleGUI as sg

layout = [
    [sg.Text("Qual é a sua meta financeira R$")],
    [sg.InputText(key="meta_financeira")],
    [sg.Text("Quanto você pode economizar mensalmente R$")],
    [sg.InputText(key="economia_mensal")],
    [sg.Text("Escolha a finalidade da sua meta:")],
    [sg.Radio("Aposentadoria", "finalidade", default=False, key="Aposentadoria")],
    [sg.Radio("Compra do Carro", "finalidade", key="Compra do Carro")],
    [sg.Radio("Compra da Casa", "finalidade", key="Compra da Casa")],
    [sg.Radio("Liberdade Financeira", "finalidade", key="Liberdade Financeira")],
    [sg.Radio("Viagem", "finalidade", key="Viagem")],
    [sg.Button("Calcular"), sg.Button("Nova Simulação")]
]

result_layout = [
    [sg.Text("", text_color="red", key="good_luck_message")]
]

window = sg.Window("Calculadora de Meta Financeira", layout + result_layout)

while True:
    event, values = window.read()

    if event == sg.WIN_CLOSED:
        break
    if event == "Calcular":
        try:
            meta_financeira = float(values["meta_financeira"])
            economia_mensal = float(values["economia_mensal"])
            finalidade = [key for key in values if key != "meta_financeira" and key != "economia_mensal" and values[key]][0]

            anos_necessarios = int(meta_financeira / (economia_mensal * 12))
            meses_adicionais = int((meta_financeira % (economia_mensal * 12)) / economia_mensal)

            resultado = f"Sua meta financeira é de R$ {meta_financeira:.2f}\n"
            resultado += f"Você vai economizar mensalmente: R$ {economia_mensal:.2f}\n"
            resultado += f"Economizando mensalmente R$ {economia_mensal:.2f}, você vai conseguir o seu objetivo em:\n"
            resultado += f"Anos: {anos_necessarios}\n"
            resultado += f"Meses: {meses_adicionais}\n"
            resultado += f"Você vai alcançar a sua meta de {finalidade} mantendo essa disciplina financeira mensalmente."

            window["good_luck_message"].update("", text_color="purple")
            sg.popup("Resultado", resultado)
        except ValueError:
            sg.popup_error("Erro", "Por favor, insira valores válidos.")
    if event == "Nova Simulação":
        window["meta_financeira"].update("")
        window["economia_mensal"].update("")

window.close()
