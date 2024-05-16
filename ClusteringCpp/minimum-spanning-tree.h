/*
 * В данном файле содержится интерфейс функции для формирования минимального остовного дерева графа.
 */

#include <vector>

#include "clustering-object.h"

std::vector<std::vector<size_t>> createMinimumSpanningTree(
	std::vector<ClusteringObject*>& clusteringObjects
);
