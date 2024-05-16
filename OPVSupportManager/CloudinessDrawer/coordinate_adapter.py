# В данном файле содержится класс для преобразования координат.

class CoordinateAdapter:
    def __init__(self):
        self.display = None
        self.x_in_image = 0
        self.y_in_image = 0

    def set_display(self, display):
        self.display = display

    def set(self,
            x,
            y,
            coordinate_system):
        if coordinate_system == "image":
            self.x_in_image = x
            self.y_in_image = y
        elif coordinate_system == "display":
            self.x_in_image = x + self.display.get_offset_x()
            self.y_in_image = -y + self.display.get_offset_y()

    def get_x(self, coordinate_system):
        if coordinate_system == "image":
            return self.x_in_image
        if coordinate_system == "display":
            return self.x_in_image - self.display.get_offset_x()

    def get_y(self, coordinate_system):
        if coordinate_system == "image":
            return self.y_in_image
        elif coordinate_system == "display":
            return -self.y_in_image + self.display.get_offset_y()