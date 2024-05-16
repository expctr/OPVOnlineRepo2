/*
 * В данном файле содержится интерфейс класса, который является взвешенным ребром графа.
 */

#pragma once

struct Edge {
	size_t firstIndex;

	size_t secondIndex;

	double weight;

	Edge(const size_t& firstIndex, const size_t& secondIndex, const size_t& weight);

	bool operator<(const Edge& other);
};