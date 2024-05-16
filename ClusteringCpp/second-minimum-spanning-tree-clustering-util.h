/*
 * � ������ ����� ���������� ��������� ������, ������� ��������� �������� ������������� �� ������ ������������
 * ��������� ������ (��� ������� �� ���� ��������� ��� �����, ��� ������� ������ ������).
 */


#pragma once


#pragma once

#include <vector>

#include "graph-clustering-util.h"

class SecondMinimumSpanningTreeClusteringUtil {
	double maxWeight;

	GraphClusteringUtil* graphClusteringUtil;

public:

	SecondMinimumSpanningTreeClusteringUtil(
		const double& maxWeight,
		std::vector<ClusteringObject*>& clusteringObjects
	);

	std::vector<std::vector<size_t>> splitGraph(
		std::vector<std::vector<size_t>>& graph
	);

	void setClusteringObjects(
		std::vector<ClusteringObject*>* clusteringObjects
	);

	void getClusters(std::vector<std::vector<size_t>>& clusters);

	std::vector<std::vector<size_t>> getComponents(
		std::vector<std::vector<size_t>>& graph
	);
};