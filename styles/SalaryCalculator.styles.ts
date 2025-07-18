import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#e74c3c",
	},
	container: {
		flex: 1,
		backgroundColor: "#e74c3c",
		paddingHorizontal: 20,
	},
	header: {
		alignItems: "center",
		marginBottom: 20,
	},
	title: {
		color: "white",
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
	},
	section: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	sectionTitle: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 10,
		flex: 1,
		textTransform: "uppercase",
	},
	inputRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	inputGroup: {
		flex: 0.48,
	},
	label: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	labelText: {
		color: "white",
		fontSize: 12,
	},
	badgeText: {
		backgroundColor: "#c0392b",
		color: "white",
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 3,
		fontSize: 10,
	},
	input: {
		backgroundColor: "white",
		borderRadius: 4,
		padding: 12,
		fontSize: 16,
		color: "#e74c3c",
	},
	optionsContainer: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 15,
		flexDirection: "row",
		flexWrap: "wrap",
	},
	option: {
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 12,
		flex: 1,
	},
	bonusOption: {
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 10,
		width: "20%",
	},
	radio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#bdc3c7",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	radioSelected: {
		borderColor: "#e74c3c",
	},
	radioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#e74c3c",
	},
	optionLabel: {
		color: "#2c3e50",
		fontSize: 12,
		textAlign: "center",
	},
	optionLabelSelected: {
		color: "#e74c3c",
		fontWeight: "bold",
	},
	sliderSection: {
		marginVertical: 20,
	},
	sliderContainer: {
		backgroundColor: "white",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 20,
		marginTop: 10,
	},
	slider: {
		width: "100%",
		height: 40,
	},
	resultSection: {
		marginVertical: 20,
	},
	resultTitle: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 15,
		textTransform: "uppercase",
	},
	resultRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	resultGroup: {
		flex: 0.48,
	},
	resultLabel: {
		color: "white",
		fontSize: 12,
		marginBottom: 5,
	},
	resultInput: {
		backgroundColor: "white",
		borderRadius: 4,
		padding: 12,
		fontSize: 16,
		color: "#e74c3c",
	},
	clearButton: {
		backgroundColor: "#c0392b",
		borderRadius: 4,
		padding: 15,
		alignItems: "center",
		marginVertical: 20,
		borderWidth: 1,
		borderColor: "#a93226",
	},
	clearButtonText: {
		color: "white",
		fontSize: 14,
		fontWeight: "bold",
		textTransform: "uppercase",
	},
});