/*
 * В данном файле содержится реализация функций для рандомизации.
 */

#include <random>
#include <chrono>
#include <vector>

#include "clustering-object.h"

double getRandomNumber(
	const double& lowerBound,
	const double& upperBound) {
	//std::cout << "lowerBound: " << lowerBound << "; upperBound: " << upperBound << "\n";
	//srand(time(NULL));
	double ratio = ((double)rand() / (double)RAND_MAX);
	return lowerBound + ratio * (upperBound - lowerBound);
}

void randomShuffle(std::vector<size_t>* clusteringObjects) {
	for (int i = clusteringObjects->size() - 1; i > -1; --i) {
		//srand(time(NULL));
		int j = rand() % (i + 1);

		size_t buffer = (*clusteringObjects)[i];
		(*clusteringObjects)[i] = (*clusteringObjects)[j];
		(*clusteringObjects)[j] = buffer;
	}
}