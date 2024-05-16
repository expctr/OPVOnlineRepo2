/*
 * В данном файле содержится реализация функции для формирования минимального остовного дерева графа.
 */

#include <utility>
#include <limits>
#include <thread>

#include "minimum-spanning-tree.h"
#include "geometry.h"

std::pair<double, int>* outerTable;
size_t outerTableSize;

double getDistance(
	size_t firstIndex,
	size_t secondIndex,
	std::vector<ClusteringObject*>& clusteringObjects);

void doPartialMinimumSpanningTreeCreation(size_t beginIndex, size_t endIndex, std::vector<bool>& visited, int currentIndex, std::vector<ClusteringObject*>& clusteringObjects) {
	for (size_t i = beginIndex; i < endIndex; ++i) {
		if (visited[i]) {
			continue;
		}

		double currentDistance = getDistance(currentIndex, i, clusteringObjects);

		if (outerTable[i].first > currentDistance) {
			outerTable[i] = std::pair<double, int>(currentDistance, currentIndex);
		}
	}
}

int findIndex(std::vector<bool>& visited, std::vector<std::pair<double, int>>& table) {
	int resultIndex = -1;

	for (size_t i = 0; i < visited.size(); ++i) {
		if (!visited[i]) {
			resultIndex = i;
			break;
		}
	}

	if (resultIndex == -1) {
		return -1;
	}

	double resultLambda = table[resultIndex].first;

	for (size_t i = 0; i < table.size(); ++i) {
		if (visited[i]) {
			continue;
		}

		if (table[i].first < resultLambda) {
			resultIndex = i;
			resultLambda = table[i].first;
		}
	}

	return resultIndex;
}

double getDistance(
	size_t firstIndex,
	size_t secondIndex,
	std::vector<ClusteringObject*>& clusteringObjects) {
	if (firstIndex == secondIndex) {
		return std::numeric_limits<double>::infinity();
	}

	auto firstCoordinates = clusteringObjects[firstIndex]->getCoordinates();
	auto secondCoordinates = clusteringObjects[secondIndex]->getCoordinates();

	double result = getEulideanDistance(
		*firstCoordinates,
		*secondCoordinates
	);

	delete firstCoordinates;
	delete secondCoordinates;

	return result;
}

std::vector<std::vector<size_t>> createMinimumSpanningTree(
	std::vector<ClusteringObject*>& clusteringObjects
) {
	std::vector<bool> visited = std::vector<bool>(clusteringObjects.size(), false);
	std::vector<std::pair<double, int>> table;

	table.push_back(std::pair<double, int>(0, -1));
	for (size_t i = 1; i < clusteringObjects.size(); ++i) {
		table.push_back(std::pair<double, int>(std::numeric_limits<double>::infinity(), -1));
	}

	outerTable = new std::pair<double, int>[clusteringObjects.size()];
	outerTableSize = clusteringObjects.size();
	outerTable[0] = std::pair<double, int>(0, -1);
	for (size_t i = 1; i < clusteringObjects.size(); ++i) {
		outerTable[i] = std::pair<double, int>(std::numeric_limits<double>::infinity(), -1);
	}

	int currentIndex;
	int counter = 0;

	while (-1 != (currentIndex = findIndex(visited, table))) {
		std::cout << "minimum spanning tree creation. iteration: " << counter++ << "\n";
		//for (size_t i = 0; i < table.size(); ++i) {
		//	if (visited[i]) {
		//		continue;
		//	}

		//	double currentDistance = getDistance(currentIndex, i, clusteringObjects);

		//	if (table[i].first > currentDistance) {
		//		table[i] = std::pair<double, int>(currentDistance, currentIndex);
		//	}
		//}

		std::thread thread1(doPartialMinimumSpanningTreeCreation, 0, table.size() / 5, std::ref(visited), currentIndex, std::ref(clusteringObjects));
		std::thread thread2(doPartialMinimumSpanningTreeCreation, table.size() / 5, 2 * table.size() / 5, std::ref(visited), currentIndex, std::ref(clusteringObjects));
		std::thread thread3(doPartialMinimumSpanningTreeCreation, 2 * table.size() / 5, 3 * table.size() / 5, std::ref(visited), currentIndex, std::ref(clusteringObjects));
		std::thread thread4(doPartialMinimumSpanningTreeCreation, 3 * table.size() / 5,  4 * table.size() / 5, std::ref(visited), currentIndex, std::ref(clusteringObjects));
		doPartialMinimumSpanningTreeCreation(4 * table.size() / 5, table.size(), visited, currentIndex, clusteringObjects);

		thread1.join();
		thread2.join();
		thread3.join();
		thread4.join();

		visited[currentIndex] = true;
	}

	for (size_t i = 0; i < outerTableSize; ++i) {
		table[i] = outerTable[i];
	}

	std::vector<std::vector<size_t>> result;

	for (size_t i = 0; i < table.size(); ++i) {
		result.push_back(std::vector<size_t>());
	}

	for (size_t i = 1; i < table.size(); ++i) {
		result[i].push_back(table[i].second);
		result[table[i].second].push_back(i);
	}

	return result;
}