# В этом файле содержится реализация класса для выделения из списка путей трех последних путей
# при переборе данных путей по порядку.

class ThreeLastPathsUtil:
    def __init__(self):
        self.paths = [None, None, None]

    def accept_path(self, path):
        self.paths[0] = self.paths[1]
        self.paths[1] = self.paths[2]
        self.paths[2] = path
