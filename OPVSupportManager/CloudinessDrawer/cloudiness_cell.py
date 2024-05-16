# В данном файле содержится класс, который соответствует фрагменту изображения облачности.

import math


class CloudinessCell:
    def __init__(self, geomagnetic_latitude, mlt):
        self.geomagnetic_latitude = geomagnetic_latitude
        self.mlt = mlt

    def set(self, geomagnetic_latitude, mlt):
        self.geomagnetic_latitude = geomagnetic_latitude
        self.mlt = mlt

    def get_standard_polar_distance(self, display_width):
        return (90 - self.geomagnetic_latitude) / 80 * display_width

    def get_standard_polar_angle(self):
        return (self.mlt - 6) * math.pi / 12

    def get_standard_x(self, display_width):
        return self.get_standard_polar_distance(display_width) * math.cos(self.get_standard_polar_angle())

    def get_standard_y(self, display_width):
        return self.get_standard_polar_distance(display_width) * math.sin(self.get_standard_polar_angle())
