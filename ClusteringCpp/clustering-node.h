/*
 * � ������ ����� ���������� ��������� ������, ������� ������������� ���� ��� �������������. 
 */

#pragma once

#include "double-array.h"

class ClusteringNode {
	DoubleArray* coordinates;

	DoubleArray* savedCoordinates;

public:

	ClusteringNode(DoubleArray* coordinates);

	~ClusteringNode();

	void rewriteSavedCoordinates();

	bool deflected(const double& convergencePrecision);

	DoubleArray* getCoordinates();

	void setCoordinates(DoubleArray* coordinates);

	void setSavedCoordinates(DoubleArray* coordinates);

	DoubleArray* getSavedCoordinates();
};