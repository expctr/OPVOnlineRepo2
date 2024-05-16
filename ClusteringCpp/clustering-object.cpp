/*
 * В данном файле содержится реализация класса, который является объектом кластеризации.
 */

#include "clustering-object.h"

ClusteringObject::ClusteringObject(const std::string& path) {
	this->path = path;

	DoubleArray* fullCoordinates = getCoordinates();
	coordinates = new DoubleArray(1000); 

	for (size_t i = 0; i < 1000; ++i) {
		//coordinates->set(i, fullCoordinates->get(i + fullCoordinates->getSize() - 1000));
		coordinates->set(i, fullCoordinates->get(i));
	}

	//for (size_t i = 0; i < 1000; ++i) {
	//	std::cout << "coordinates[" << i << "]: " << coordinates->get(i) << "\n";
	//}

	//exit(0);
}

ClusteringObject::~ClusteringObject() {
	delete coordinates;
}

DoubleArray* ClusteringObject::getCoordinates() const {
	if (coordinates != nullptr) {
		return coordinates->getCopy();
	}

	std::ifstream infile(path);
	std::string line;

	DoubleArray* doubleArray = new DoubleArray(countLinesInFile(path) - 1);
	int iterationNumber = 0;

	while (std::getline(infile, line))
	{
		if (iterationNumber == 0) {
			++iterationNumber;
			continue;
		}

		//if (iterationNumber > 1000) {
		//	break;
		//}

		doubleArray->set(iterationNumber - 1, extractValue(line));

		++iterationNumber;
	}

	infile.close();

	return doubleArray;
}

int ClusteringObject::countLinesInFile(const std::string& path) const {
	std::ifstream infile(path);
	std::string line;
	int numberOfLinesInFile = 0;

	while (std::getline(infile, line))
	{
		++numberOfLinesInFile;
	}

	//std::cout << "numberOfLinesInFile: " << numberOfLinesInFile << "\n";
	infile.close();
	return numberOfLinesInFile;
}

double ClusteringObject::extractValue(const std::string& line) const {
	std::string valueRepresentation;
	int delimeterVisitsNumber = 0;

	for (int i = 0; i < line.size(); ++i) {
		if (line[i] == ';') {
			++delimeterVisitsNumber;
			continue;
		}

		if (delimeterVisitsNumber == 1) {
			valueRepresentation += line[i];
		}
		else if (delimeterVisitsNumber == 2) {
			break;
		}
	}

	//std::cout << valueRepresentation << "\n";
	return std::stod(valueRepresentation);
}

size_t ClusteringObject::getSize() const {
	DoubleArray* coordinates = getCoordinates();
	size_t size = coordinates->getSize();

	delete coordinates;
	return size;
}

std::string ClusteringObject::getPath() const {
	return path;
}