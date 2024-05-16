/*
 * В данном файле содержится интерфейс класса, который является массивом действительных чисел. 
 */

#pragma once

class DoubleArray {
	double* array;

	size_t size;

public:
	DoubleArray(const size_t& size);

	~DoubleArray();

	double get(const size_t& index) const;

	void set(const size_t& index, const double& value);

	size_t getSize() const;

	void add(const DoubleArray& other);

	void divide(const double& devisor);

	//void multiply(const double& factor);
	
	void addMutilpliedDoubleArray(const double& factor, const DoubleArray& other);

	double getMin() const;

	double getMax() const;

	DoubleArray* getCopy() const;

	void copy(const DoubleArray& other);

	void applyMin(const DoubleArray& other);

	void applyMax(const DoubleArray& other);
};
