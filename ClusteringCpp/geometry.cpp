/*
 * В данном файле содержится реализация функций для выполнения геометрических вычислений.
 */

#include <cmath>
#include <limits>

#include "double-array.h"
#include "geometry.h"
#include "double-array-2d.h"
#include "clustering-object-list.h"
#include "random-algorithm.h"

double getEulideanDistance(const DoubleArray& firstPoint, const DoubleArray& secondPoint) {
	//std::cout << "begin euclidean distance\n";
	double squareSum = 0;

	for (int i = 0; i < firstPoint.getSize(); ++i) {
		// std::cout << "i: " << i << " firstPoint.get: " << firstPoint.get(i) << ", secondPoint.get: " << secondPoint.get(i) << "\n";
		squareSum += pow(firstPoint.get(i) - secondPoint.get(i), 2);

		if (isnan(firstPoint.get(i))) {
			std::cout << "firstPoint.get(" << i << ") is nan\n";
			exit(-1);
		}

		if (isnan(secondPoint.get(i))) {
			std::cout << "secondPoint.get(" << i << ") is nan\n";
			exit(-1);
		}
	}

	//std::cout << "end euclidean distance\n";
	double euclideanDistance = sqrt(squareSum);

	if (isnan(euclideanDistance)) {
		std::cout << "euclidean distance is nan" << "\n";
		std::cout << "squareSum is " << squareSum << "\n";
		exit(-1);
	}

	//std::cout << "euclidean distance: " << euclideanDistance << "\n";
	return euclideanDistance;
}

DoubleArray* getBarycentre(ClusteringObjectList& clusteringObjectList) {
	DoubleArray* barycentre
		= new DoubleArray(clusteringObjectList.getHeadClusteringObjcect()->getSize());
	size_t i = 0;

	for (clusteringObjectList.beginTraversal();
		!clusteringObjectList.atEnd();
		clusteringObjectList.gotoNextClusteringObject()) {
		std::cout << "getBarycentre " << i++ << "\n";
		DoubleArray* coordinates = clusteringObjectList.getCurrentClusteringObject()->getCoordinates();

		//for (size_t i = 0; i < 7; ++i) {
		//	std::cout << "coordinates[" << i << "]: " << coordinates->get(i) << "\n";
		//}

		barycentre->add(*coordinates);

		//for (size_t i = 0; i < 7; ++i) {
		//	std::cout << "barycentre[" << i << "]: " << barycentre->get(i) << "\n";
		//}
		
		delete coordinates;
	}

	barycentre->divide(clusteringObjectList.getSize());

	//for (size_t i = 0; i < 7; ++i) {
	//	std::cout << "barycentre[" << i << "]: " << barycentre->get(i) << "\n";
	//}

	return barycentre;
}

DoubleArray* getMinFromDimensions(const std::vector<ClusteringObject*>& clusteringObjects) {
	std::cout << "start getMinFromDimensions\n";
	size_t index = getRandomNumber(0, clusteringObjects.size());
	//std::cout << "random index: " << index << "\n";
	DoubleArray* minFromDimensions = clusteringObjects[index]->getCoordinates();

	for (size_t i = 0; i < clusteringObjects.size(); ++i) {
		//continue;
		std::cout << "getMinFromDimensions: " << i  << " \ " << clusteringObjects.size() << "\n";

		if (getRandomNumber(0, 10) > 2) {
			continue;
		}

		DoubleArray* currentCoordinates = clusteringObjects[i]->getCoordinates();
		minFromDimensions->applyMin(*currentCoordinates);
		delete currentCoordinates;
	}

	return minFromDimensions;
}

DoubleArray* getMaxFromDimensions(const std::vector<ClusteringObject*>& clusteringObjects) {
	std::cout << "start getMaxFromDimensions\n";
	size_t index = getRandomNumber(0, clusteringObjects.size());
	//std::cout << "random index: " << index << "\n";
	DoubleArray* maxFromDimensions = clusteringObjects[index]->getCoordinates();

	for (size_t i = 0; i < clusteringObjects.size(); ++i) {
		//continue;
		std::cout << "getMaxFromDimensions: " << i << " \ " << clusteringObjects.size() << "\n";

		if (getRandomNumber(0, 10) > 2) {
			continue;
		}

		DoubleArray* currentCoordinates = clusteringObjects[0]->getCoordinates();
		maxFromDimensions->applyMax(*currentCoordinates);
		delete currentCoordinates;
	}

	return maxFromDimensions;
}

DoubleArray* subtractVectors(const DoubleArray& first, const DoubleArray& second) {
	//std::cout << "subtractVectors: " << first.getSize() << " " << second.getSize() << "\n";
	DoubleArray* result = new DoubleArray(first.getSize());
	//std::cout << "result was created." << "\n";

	for (size_t i = 0; i < first.getSize(); ++i) {
		result->set(i, first.get(i) - second.get(i));
	}

	return result;
}

DoubleArray* getMiddle(const DoubleArray& firstPoint, const DoubleArray& secondPoint) {
	DoubleArray* middle = new DoubleArray(firstPoint.getSize());

	for (size_t i = 0; i < firstPoint.getSize(); ++i) {
		middle->set(
			i,
			(firstPoint.get(i) + secondPoint.get(i)) / 2
		);
	}

	return middle;
}