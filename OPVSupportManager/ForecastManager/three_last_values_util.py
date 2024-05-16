# В этом файле содержится реализация класса для выделения из списка чисел трех последних
# чисел при переборе данных чисел по порядку.

class ThreeLastValuesUtil:
    def __init__(self):
        self.values = [None, None, None]

    def accept_value(self, value: float):
        self.values[0] = self.values[1]
        self.values[1] = self.values[2]
        self.values[2] = value

    def get_tuple(self):
        return self.values[0], self.values[1], self.values[2]
