/*
 * ¬ данном файле содержитс€ интерфейс класса, который €вл€етс€ двумерным массивом действительных чисел.
 */

#pragma once

#include "double-array.h"

class DoubleArray2D {
	DoubleArray* array;

	size_t size;
public:
	DoubleArray* get(const int& index) const;

	size_t getSize() const;

	DoubleArray* getSlice(const int& index) const;
};