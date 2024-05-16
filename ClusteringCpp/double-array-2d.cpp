/*
 * ¬ данном файле содержитс€ реализаци€ класса, который €вл€етс€ двумерным массивом действительных чисел.
 */

#include <iostream>

#include "double-array.h"
#include "double-array-2d.h"

DoubleArray* DoubleArray2D::get(const int& index) const {
	if (size <= index) {
		std::cerr << "Index out of range error.\n";
		exit(-1);
	}

	return &array[index];
}

size_t DoubleArray2D::getSize() const {
	return size;
}

DoubleArray* DoubleArray2D::getSlice(const int& index) const {
	DoubleArray* slice = new DoubleArray(size);

	for (int i = 0; i < size; ++i) {
		slice->set(i, array->get(index));
	}

	return slice;
}