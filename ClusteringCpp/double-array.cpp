/*
 * В данном файле содержится реализация класса, который является массивом действительных чисел.
 */

#include <iostream>
#include <algorithm>

#include "double-array.h"

DoubleArray::DoubleArray(const size_t& size) {
	array = new double[size];

	for (size_t i = 0; i < size; ++i) {
		array[i] = 0.0;
	}

	this->size = size;
}

DoubleArray::~DoubleArray() {
	delete[] array;
}

double DoubleArray::get(const size_t& index) const {
	//if (size <= index) {
	//	std::cerr << "Index out of range error.\n";
	//	exit(-1);
	//}

	return array[index];
}

void DoubleArray::set(const size_t& index, const double& value) {
	//if (size <= index) {
	//	std::cerr << "Index out of range error.\n";
	//	exit(-1);
	//}

	array[index] = value;
}

size_t DoubleArray::getSize() const {
	return size;
}

void DoubleArray::add(const DoubleArray& other) {
	for (size_t i = 0; i < size; ++i) {
		array[i] += other.get(i);
	}
}

void DoubleArray::divide(const double& devisor) {
	for (size_t i = 0; i < size; ++i) {
		array[i] /= devisor;
	}
}

void DoubleArray::addMutilpliedDoubleArray(const double& factor, const DoubleArray& other) {
	for (size_t i = 0; i < size; ++i) {
		array[i] += factor * other.array[i];
	}
}

double DoubleArray::getMin() const {
	double minValue = array[0];

	for (size_t i = 0; i < size; ++i) {
		if (array[i] < minValue) {
			minValue = array[i];
		}
	}

	return minValue;
}

double DoubleArray::getMax() const {
	double maxValue = array[0];

	for (size_t i = 0; i < size; ++i) {
		if (maxValue < array[i]) {
			maxValue = array[i];
		}
	}

	return maxValue;
}

DoubleArray* DoubleArray::getCopy() const {
	DoubleArray* copy = new DoubleArray(size);

	for (int i = 0; i < size; ++i) {
		copy->set(i, array[i]);
	}

	return copy;
}

void DoubleArray::copy(const DoubleArray& other) {
	for (size_t i = 0; i < size; ++i) {
		array[i] = other.get(i);
	}
}

void DoubleArray::applyMin(const DoubleArray& other) {
	for (size_t i = 0; i < size; ++i) {
		array[i] = std::min(array[i], other.get(i));
	}
}

void DoubleArray::applyMax(const DoubleArray& other) {
	for (size_t i = 0; i < size; ++i) {
		array[i] = std::max(array[i], other.get(i));
	}
}