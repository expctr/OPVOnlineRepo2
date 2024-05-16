/*
 * В данном файле содержится интерфейс класса, который является объектом кластеризации. 
 */

#pragma once

#include<string>
#include <sstream>
#include <fstream>
#include <iostream>
#include <vector>

#include "double-array.h"

class ClusteringObject {
	std::string path;

	DoubleArray* coordinates;

public:

	ClusteringObject(const std::string& path);

	~ClusteringObject();

	DoubleArray* getCoordinates() const;

	size_t getSize() const;

	std::string getPath() const;

private:

	int countLinesInFile(const std::string& path) const;

	double extractValue(const std::string& line) const;
};