import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function SalaryCalculator() {
	const [hourlyGross, setHourlyGross] = useState("0.11");
	const [monthlyGross, setMonthlyGross] = useState("17");
	const [annualGross, setAnnualGross] = useState("200");
	const [hourlyNet, setHourlyNet] = useState("0.09");
	const [monthlyNet, setMonthlyNet] = useState("13");
	const [annualNet, setAnnualNet] = useState("156");
	const [status, setStatus] = useState("non-cadre");
	const [workTimePercentage, setWorkTimePercentage] = useState(100);
	const [bonusMonths, setBonusMonths] = useState(12);
	const [sourceDeduction, setSourceDeduction] = useState(0);
	const [monthlyNetAfterTax, setMonthlyNetAfterTax] = useState("13");
	const [annualNetAfterTax, setAnnualNetAfterTax] = useState("159");

	const statusOptions = [
		{ label: "Salarié non-cadre", value: "non-cadre" },
		{ label: "Salarié cadre", value: "cadre" },
		{ label: "Fonction publique", value: "fonction-publique" },
		{ label: "Profession libérale", value: "profession-liberale" },
		{ label: "Portage salarial", value: "portage-salarial" },
	];

	const bonusMonthOptions = [12, 13, 14, 15, 16];

	const clearFields = () => {
		setHourlyGross("");
		setMonthlyGross("");
		setAnnualGross("");
		setHourlyNet("");
		setMonthlyNet("");
		setAnnualNet("");
		setMonthlyNetAfterTax("");
		setAnnualNetAfterTax("");
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Calcul Du Salaire Brut En Net</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>INDIQUEZ VOTRE SALAIRE BRUT</Text>
				<Text style={styles.sectionTitle}>RÉSULTAT DE VOTRE SALAIRE NET</Text>
			</View>

			<View style={styles.inputRow}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Horaire brut</Text>
					<TextInput
						style={styles.input}
						value={hourlyGross}
						onChangeText={setHourlyGross}
						keyboardType="numeric"
					/>
				</View>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Horaire net</Text>
					<TextInput
						style={styles.input}
						value={hourlyNet}
						onChangeText={setHourlyNet}
						keyboardType="numeric"
					/>
				</View>
			</View>

			<View style={styles.inputRow}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Mensuel brut
						<Text style={styles.badgeText}> Non-cadre -22%</Text>
					</Text>
					<TextInput
						style={styles.input}
						value={monthlyGross}
						onChangeText={setMonthlyGross}
						keyboardType="numeric"
					/>
				</View>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Mensuel net</Text>
					<TextInput
						style={styles.input}
						value={monthlyNet}
						onChangeText={setMonthlyNet}
						keyboardType="numeric"
					/>
				</View>
			</View>

			<View style={styles.inputRow}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Annuel brut</Text>
					<TextInput
						style={styles.input}
						value={annualGross}
						onChangeText={setAnnualGross}
						keyboardType="numeric"
					/>
				</View>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Annuel net</Text>
					<TextInput
						style={styles.input}
						value={annualNet}
						onChangeText={setAnnualNet}
						keyboardType="numeric"
					/>
				</View>
			</View>

			<View style={styles.statusSection}>
				<Text style={styles.sectionTitle}>SÉLECTIONNEZ VOTRE STATUT :</Text>
				<View style={styles.statusOptions}>
					{statusOptions.map((option) => (
						<TouchableOpacity
							key={option.value}
							style={[
								styles.statusOption,
								status === option.value && styles.statusOptionSelected,
							]}
							onPress={() => setStatus(option.value)}
						>
							<View
								style={[
									styles.radio,
									status === option.value && styles.radioSelected,
								]}
							>
								{status === option.value && <View style={styles.radioInner} />}
							</View>
							<Text
								style={[
									styles.statusLabel,
									status === option.value && styles.statusLabelSelected,
								]}
							>
								{option.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<View style={styles.sliderSection}>
				<Text style={styles.sectionTitle}>
					SÉLECTIONNEZ VOTRE TEMPS DE TRAVAIL : {workTimePercentage}%
				</Text>
				<View style={styles.sliderContainer}>
					<Slider
						style={styles.slider}
						minimumValue={0}
						maximumValue={100}
						value={workTimePercentage}
						onValueChange={setWorkTimePercentage}
						step={1}
						minimumTrackTintColor="#e74c3c"
						maximumTrackTintColor="#e0e0e0"
						thumbTintColor="#e74c3c"
					/>
				</View>
			</View>

			<View style={styles.bonusSection}>
				<Text style={styles.sectionTitle}>
					SÉLECTIONNEZ LE NOMBRE DE MOIS DE PRIME CONVENTIONNELLE:
				</Text>
				<View style={styles.bonusOptions}>
					{bonusMonthOptions.map((months) => (
						<TouchableOpacity
							key={months}
							style={[
								styles.bonusOption,
								bonusMonths === months && styles.bonusOptionSelected,
							]}
							onPress={() => setBonusMonths(months)}
						>
							<View
								style={[
									styles.radio,
									bonusMonths === months && styles.radioSelected,
								]}
							>
								{bonusMonths === months && <View style={styles.radioInner} />}
							</View>
							<Text
								style={[
									styles.bonusLabel,
									bonusMonths === months && styles.bonusLabelSelected,
								]}
							>
								{months} mois
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<View style={styles.deductionSection}>
				<Text style={styles.sectionTitle}>
					SÉLECTIONNEZ LE TAUX DE PRÉLÈVEMENT À LA SOURCE:{" "}
					{sourceDeduction.toFixed(1)}%
				</Text>
				<View style={styles.sliderContainer}>
					<Slider
						style={styles.slider}
						minimumValue={0}
						maximumValue={100}
						value={sourceDeduction}
						onValueChange={setSourceDeduction}
						step={0.1}
						minimumTrackTintColor="#e74c3c"
						maximumTrackTintColor="#e0e0e0"
						thumbTintColor="#e74c3c"
					/>
				</View>
			</View>

			<View style={styles.resultSection}>
				<Text style={styles.resultTitle}>
					ESTIMATION DE VOTRE SALAIRE NET APRÈS LE PRÉLÈVEMENT À LA SOURCE
				</Text>
				<View style={styles.resultRow}>
					<View style={styles.resultGroup}>
						<Text style={styles.resultLabel}>Mensuel net après impôts</Text>
						<TextInput
							style={styles.resultInput}
							value={monthlyNetAfterTax}
							onChangeText={setMonthlyNetAfterTax}
							keyboardType="numeric"
						/>
					</View>
					<View style={styles.resultGroup}>
						<Text style={styles.resultLabel}>Annuel net après impôts</Text>
						<TextInput
							style={styles.resultInput}
							value={annualNetAfterTax}
							onChangeText={setAnnualNetAfterTax}
							keyboardType="numeric"
						/>
					</View>
				</View>
			</View>

			<TouchableOpacity style={styles.clearButton} onPress={clearFields}>
				<Text style={styles.clearButtonText}>EFFACER LES CHAMPS</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e74c3c",
		paddingHorizontal: 20,
		paddingTop: 20,
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
		color: "white",
		fontSize: 12,
		marginBottom: 5,
	},
	badgeText: {
		backgroundColor: "#c0392b",
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
		fontWeight: "bold",
	},
	statusSection: {
		marginVertical: 20,
	},
	statusOptions: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 15,
	},
	statusOption: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	statusOptionSelected: {
		// Selected styling handled by radio
	},
	radio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#bdc3c7",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
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
	statusLabel: {
		color: "#2c3e50",
		fontSize: 14,
	},
	statusLabelSelected: {
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
	bonusSection: {
		marginVertical: 20,
	},
	bonusOptions: {
		flexDirection: "row",
		backgroundColor: "white",
		borderRadius: 8,
		padding: 15,
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	bonusOption: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		width: "30%",
	},
	bonusOptionSelected: {
		// Selected styling handled by radio
	},
	bonusLabel: {
		color: "#2c3e50",
		fontSize: 12,
	},
	bonusLabelSelected: {
		color: "#e74c3c",
		fontWeight: "bold",
	},
	deductionSection: {
		marginVertical: 20,
	},
	resultSection: {
		marginVertical: 20,
	},
	resultTitle: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 15,
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
		fontWeight: "bold",
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
	},
});
