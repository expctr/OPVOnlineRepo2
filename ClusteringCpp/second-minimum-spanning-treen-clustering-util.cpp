/*
 * В данном файле содержится реализация класса, который реализует алгоритм кластеризации на основе минимального
 * остовного дерева (при котором из него удаляются все ребра, вес которых больше порога).
 */

#include <algorithm>

#include "second-minimum-spanning-tree-clustering-util.h"
#include "minimum-spanning-tree.h"
#include "edge.h"

SecondMinimumSpanningTreeClusteringUtil::SecondMinimumSpanningTreeClusteringUtil(
	const double& maxWeight,
	std::vector<ClusteringObject*>& clusteringObjects
) {
	graphClusteringUtil = new GraphClusteringUtil();
	graphClusteringUtil->setClusteringObjects(&clusteringObjects);

	this->maxWeight = maxWeight;
}

std::vector<std::vector<size_t>> SecondMinimumSpanningTreeClusteringUtil::splitGraph(
	std::vector<std::vector<size_t>>& graph
) {
	std::vector<Edge> edges;

	for (size_t i = 0; i < graph.size(); ++i) {
		std::cout << "splitGraph. i: " << i << " from " << graph.size() << "\n";
		for (size_t j = 0; j < graph[i].size(); ++j) {
			if (i >= graph[i][j]) {
				continue;
			}

			edges.push_back(
				Edge(
					i,
					graph[i][j],
					graphClusteringUtil->getDistance(i, graph[i][j])
				));
		}
	}

	std::sort(edges.begin(), edges.end());
	std::vector<std::vector<size_t>> result;

	for (auto& i : graph) {
		result.push_back(i);
	}

	for (size_t i = 0; i < edges.size(); ++i) {
		std::cout << "splitGraph next cycle. i: " << i << " from " << edges.size() << "\n";

		if (edges[i].weight > maxWeight) {
			result[edges[i].firstIndex]
				.erase(
					std::remove(
						result[edges[i].firstIndex].begin(),
						result[edges[i].firstIndex].end(),
						edges[i].secondIndex
					),
					result[edges[i].firstIndex].end()
				);
			result[edges[i].secondIndex]
				.erase(
					std::remove(
						result[edges[i].secondIndex].begin(),
						result[edges[i].secondIndex].end(),
						edges[i].firstIndex
					),
					result[edges[i].secondIndex].end()
				);
		}
	}

	return result;
}

void SecondMinimumSpanningTreeClusteringUtil::setClusteringObjects(
	std::vector<ClusteringObject*>* clusteringObjects
) {
	graphClusteringUtil->setClusteringObjects(clusteringObjects);
}

void SecondMinimumSpanningTreeClusteringUtil::getClusters(
	std::vector<std::vector<size_t>>& clusters
) {
	auto minimumSpanningTree = createMinimumSpanningTree(
		*(graphClusteringUtil->getClusteringObjects())
	);

	graphClusteringUtil->setMinimumSpanningTree(
		&minimumSpanningTree
	);

	auto splittedGraph = splitGraph(*graphClusteringUtil->getMinimumSpanningTree());
	auto components = getComponents(splittedGraph);

	std::cout << "components.size(): " << components.size() << "\n";

	clusters.clear();

	for (auto& component : components) {
		clusters.push_back(std::vector<size_t>());

		for (auto& index : component) {
			clusters[clusters.size() - 1].push_back(index);
		}
	}
}

std::vector<std::vector<size_t>> SecondMinimumSpanningTreeClusteringUtil::getComponents(
	std::vector<std::vector<size_t>>& graph
) {
	std::vector<std::vector<size_t>> result;
	std::vector<bool> visited = std::vector<bool>(graph.size(), false);
	std::vector<bool> added = std::vector<bool>(
		graphClusteringUtil->getClusteringObjects()->size(), false);

	std::vector<size_t> currentComponent;
	std::vector<size_t> currentLayer;
	std::vector<size_t> nextLayer;

	for (size_t i = 0; i < graphClusteringUtil->getClusteringObjects()->size(); ++i) {
		if (visited[i]) {
			continue;
		}

		currentComponent.clear();
		currentLayer.clear();
		currentLayer.push_back(i);

		while (currentLayer.size() > 0) {
			for (auto& index : currentLayer) {
				visited[index] = true;
				currentComponent.push_back(index);
			}

			nextLayer.clear();

			for (size_t i = 0; i < added.size(); ++i) {
				added[i] = false;
			}

			for (auto& index : currentLayer) {
				for (auto& innerIndex : graph[index]) {
					if (!visited[innerIndex] && !added[innerIndex]) {
						nextLayer.push_back(innerIndex);
						added[innerIndex] = true;
					}
				}
			}

			currentLayer.swap(nextLayer);
		}

		result.push_back(currentComponent);
	}

	return result;
}

//std::vector<size_t> eraseByValue(const std::vector<size_t>& inputVector, const size_t& valueToBeErased) {
//	std::vector<size_t> result;
//
//	size_t indexToBeErased = -1;
//
//	for (size_t i = 0; i < inputVector.size(); ++i) {
//		if (inputVector[i] == valueToBeErased) {
//			indexToBeErased = i;
//			break;
//		}
//	}
//
//	for (size_t i = 0; i < inputVector.size(); ++i) {
//		if (i != indexToBeErased) {
//			result.push_back(inputVector[i]);
//		}
//	}
//
//	return result;
//}