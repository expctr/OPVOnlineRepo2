# В данном файле содержится реализация класса, который соответствует дисплею для рисования.

from PIL import Image, ImageDraw

from coordinate_adapter import CoordinateAdapter

THIS_FILENAME = "display.py"

class Display:
    def __init__(self):
        self.img = Image.new(mode="RGBA", size=(400, 400), color=(0, 0, 0, 0))
        self.draw = ImageDraw.Draw(self.img)
        self.width = 0
        self.height = 0
        self.offset_x = 0
        self.offset_y = 0

        self.make_default_offset_and_sizes()

    def get_offset_x(self):
        return self.offset_x

    def get_offset_y(self):
        return self.offset_y

    def make_default_offset_and_sizes(self):
        self.width = self.img.width
        self.height = self.img.height

        self.offset_x = self.img.width * 0.5
        self.offset_y = self.img.height * 0.5

    def fill_tetragon(self,
                      x1,
                      y1,
                      x2,
                      y2,
                      x3,
                      y3,
                      x4,
                      y4,
                      color):
        first_coordinate_adapter = CoordinateAdapter()
        second_coordinate_adapter = CoordinateAdapter()
        third_coordinate_adapter = CoordinateAdapter()
        fourth_coordinate_adapter = CoordinateAdapter()

        first_coordinate_adapter.set_display(self)
        second_coordinate_adapter.set_display(self)
        third_coordinate_adapter.set_display(self)
        fourth_coordinate_adapter.set_display(self)

        first_coordinate_adapter.set(x1, y1, "display")
        second_coordinate_adapter.set(x2, y2, "display")
        third_coordinate_adapter.set(x3, y3, "display")
        fourth_coordinate_adapter.set(x4, y4, "display")

        self.draw.polygon(
            ((first_coordinate_adapter.get_x("image"), first_coordinate_adapter.get_y("image")),
             (second_coordinate_adapter.get_x("image"), second_coordinate_adapter.get_y("image")),
             (third_coordinate_adapter.get_x("image"), third_coordinate_adapter.get_y("image")),
             (fourth_coordinate_adapter.get_x("image"), fourth_coordinate_adapter.get_y("image"))),
            fill=color
        )

    def save(self, path):
        print(f"Message from {THIS_FILENAME}. save image to: {path}")
        self.img.save(path)
