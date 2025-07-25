import Slider from "@react-native-community/slider";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { z } from "zod";

const StatusEnum = z.enum([
	"non-cadre",
	"cadre",
	"fonction-publique",
	"profession-liberale",
	"portage-salarial",
]);

type Status = z.infer<typeof StatusEnum>;

const deductionRates: Record<Status, number> = {
	"non-cadre": 0.22,
	cadre: 0.25,
	"fonction-publique": 0.17,
	"profession-liberale": 0.35,
	"portage-salarial": 0.47,
};

const generateStatusTooltips = (
	rates: Record<Status, number>,
): Record<Status, string> => {
	return {
		"non-cadre": `Non-cadre -${Math.round(rates["non-cadre"] * 100)}%`,
		cadre: `Cadre -${Math.round(rates.cadre * 100)}%`,
		"fonction-publique": `Public -${Math.round(rates["fonction-publique"] * 100)}%`,
		"profession-liberale": `Indé -${Math.round(rates["profession-liberale"] * 100)}%`,
		"portage-salarial": `Port -${Math.round(rates["portage-salarial"] * 100)}%`,
	};
};

const roundToDecimals = (value: number, decimals: number): number => {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
};

const roundToCents = (value: number): number => {
	return roundToDecimals(value, 2);
};

const roundToWhole = (value: number): number => {
	return Math.round(value);
};

const formatHourlyRate = (value: number): string => {
	const rounded = roundToCents(value);
	return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
};

export default function SalaryCalculator() {
	const statusBarHeight = StatusBar.currentHeight || 0;
	const isIOS = Platform.OS === "ios";
	const [status, setStatus] = useState<Status>("non-cadre");
	const [workTimePercentage, setWorkTimePercentage] = useState(100);
	const [bonusMonths, setBonusMonths] = useState(12);
	const [sourceDeduction, setSourceDeduction] = useState(0);
	const [monthlyNetAfterTax, setMonthlyNetAfterTax] = useState("0");
	const [annualNetAfterTax, setAnnualNetAfterTax] = useState("0");
	const [focusedInput, setFocusedInput] = useState<string | null>(null);
	const [inputValues, setInputValues] = useState<Record<string, string>>({});

	// Track previous dependency values to avoid infinite loops
	const prevDepsRef = useRef({
		status,
		workTimePercentage,
		bonusMonths,
		sourceDeduction,
	});

	// Internal exact values for precise calculations using BigNumber
	const [exactValues, setExactValues] = useState({
		hourlyGross: new BigNumber(0),
		monthlyGross: new BigNumber(0),
		annualGross: new BigNumber(0),
		hourlyNet: new BigNumber(0),
		monthlyNet: new BigNumber(0),
		annualNet: new BigNumber(0),
		monthlyNetAfterTax: new BigNumber(0),
		annualNetAfterTax: new BigNumber(0),
	});

	// Computed display values from exact values (or raw input when focused)
	const hourlyGross =
		focusedInput === "hourlyGross"
			? inputValues.hourlyGross || ""
			: exactValues.hourlyGross.isZero()
				? ""
				: formatHourlyRate(exactValues.hourlyGross.toNumber());
	const monthlyGross =
		focusedInput === "monthlyGross"
			? inputValues.monthlyGross || ""
			: exactValues.monthlyGross.isZero()
				? ""
				: roundToWhole(exactValues.monthlyGross.toNumber()).toString();
	const annualGross =
		focusedInput === "annualGross"
			? inputValues.annualGross || ""
			: exactValues.annualGross.isZero()
				? ""
				: roundToWhole(exactValues.annualGross.toNumber()).toString();
	const hourlyNet =
		focusedInput === "hourlyNet"
			? inputValues.hourlyNet || ""
			: exactValues.hourlyNet.isZero()
				? ""
				: formatHourlyRate(exactValues.hourlyNet.toNumber());
	const monthlyNet =
		focusedInput === "monthlyNet"
			? inputValues.monthlyNet || ""
			: exactValues.monthlyNet.isZero()
				? ""
				: roundToWhole(exactValues.monthlyNet.toNumber()).toString();
	const annualNet =
		focusedInput === "annualNet"
			? inputValues.annualNet || ""
			: exactValues.annualNet.isZero()
				? ""
				: roundToWhole(exactValues.annualNet.toNumber()).toString();

	const getDeductionRate = useCallback((status: Status): number => {
		return deductionRates[status];
	}, []);

	const calculateFromGrossToNet = useCallback(
		(grossAmount: BigNumber): BigNumber => {
			const deductionRate = new BigNumber(getDeductionRate(status));
			const workTimeFactor = new BigNumber(workTimePercentage).dividedBy(100);
			const oneMinusDeduction = new BigNumber(1).minus(deductionRate);
			return grossAmount
				.multipliedBy(oneMinusDeduction)
				.multipliedBy(workTimeFactor);
		},
		[getDeductionRate, status, workTimePercentage],
	);

	const calculateFromNetToGross = useCallback(
		(netAmount: BigNumber): BigNumber => {
			const deductionRate = new BigNumber(getDeductionRate(status));
			const workTimeFactor = new BigNumber(workTimePercentage).dividedBy(100);
			const oneMinusDeduction = new BigNumber(1).minus(deductionRate);
			const denominator = oneMinusDeduction.multipliedBy(workTimeFactor);
			return netAmount.dividedBy(denominator);
		},
		[getDeductionRate, status, workTimePercentage],
	);

	const calculateAfterTax = useCallback(
		(netAmount: BigNumber): BigNumber => {
			const sourceDeductionRate = new BigNumber(sourceDeduction).dividedBy(100);
			const oneMinusDeduction = new BigNumber(1).minus(sourceDeductionRate);
			return netAmount.multipliedBy(oneMinusDeduction);
		},
		[sourceDeduction],
	);

	const updateAllFields = useCallback(
		(
			source:
				| "hourlyGross"
				| "monthlyGross"
				| "annualGross"
				| "hourlyNet"
				| "monthlyNet"
				| "annualNet",
			value: string,
		) => {
			const numValue = new BigNumber(parseFloat(value) || 0);
			const hoursPerMonth = new BigNumber(151.67);
			let monthlyGrossValue = new BigNumber(0);

			if (source === "hourlyGross") {
				monthlyGrossValue = numValue.multipliedBy(hoursPerMonth);
			} else if (source === "monthlyGross") {
				monthlyGrossValue = numValue;
			} else if (source === "annualGross") {
				monthlyGrossValue = numValue.dividedBy(bonusMonths);
			} else if (source === "hourlyNet") {
				const monthlyNetValue = numValue.multipliedBy(hoursPerMonth);
				monthlyGrossValue = calculateFromNetToGross(monthlyNetValue);
			} else if (source === "monthlyNet") {
				monthlyGrossValue = calculateFromNetToGross(numValue);
			} else if (source === "annualNet") {
				const monthlyNetValue = numValue.dividedBy(bonusMonths);
				monthlyGrossValue = calculateFromNetToGross(monthlyNetValue);
			}

			const hourlyGrossValue = monthlyGrossValue.dividedBy(hoursPerMonth);
			const annualGrossValue = monthlyGrossValue.multipliedBy(bonusMonths);

			const monthlyNetValue = calculateFromGrossToNet(monthlyGrossValue);
			const hourlyNetValue = monthlyNetValue.dividedBy(hoursPerMonth);
			const annualNetValue = monthlyNetValue.multipliedBy(bonusMonths);

			const monthlyAfterTax = calculateAfterTax(monthlyNetValue);
			const annualAfterTax = calculateAfterTax(annualNetValue);

			// Store exact values internally (computed display values will update automatically)
			setExactValues({
				hourlyGross: hourlyGrossValue,
				monthlyGross: monthlyGrossValue,
				annualGross: annualGrossValue,
				hourlyNet: hourlyNetValue,
				monthlyNet: monthlyNetValue,
				annualNet: annualNetValue,
				monthlyNetAfterTax: monthlyAfterTax,
				annualNetAfterTax: annualAfterTax,
			});

			// Update after-tax display values
			setMonthlyNetAfterTax(
				roundToWhole(monthlyAfterTax.toNumber()).toString(),
			);
			setAnnualNetAfterTax(roundToWhole(annualAfterTax.toNumber()).toString());
		},
		[
			bonusMonths,
			calculateFromGrossToNet,
			calculateFromNetToGross,
			calculateAfterTax,
		],
	);

	// Recalculate when dependencies change (status, workTimePercentage, bonusMonths, sourceDeduction)
	useEffect(() => {
		const currentDeps = {
			status,
			workTimePercentage,
			bonusMonths,
			sourceDeduction,
		};
		const prevDeps = prevDepsRef.current;

		// Check if dependencies actually changed
		const depsChanged = Object.keys(currentDeps).some(
			(key) =>
				currentDeps[key as keyof typeof currentDeps] !==
				prevDeps[key as keyof typeof prevDeps],
		);

		if (depsChanged) {
			// Update the ref with current values
			prevDepsRef.current = currentDeps;

			// Only recalculate if we have some values to work with
			if (
				!exactValues.hourlyGross.isZero() ||
				!exactValues.monthlyGross.isZero() ||
				!exactValues.annualGross.isZero() ||
				!exactValues.hourlyNet.isZero() ||
				!exactValues.monthlyNet.isZero() ||
				!exactValues.annualNet.isZero()
			) {
				// Find the first non-zero value to use as source, prioritizing monthly gross
				let source: string;
				let value: string;

				if (!exactValues.monthlyGross.isZero()) {
					source = "monthlyGross";
					value = exactValues.monthlyGross.toString();
				} else if (!exactValues.hourlyGross.isZero()) {
					source = "hourlyGross";
					value = exactValues.hourlyGross.toString();
				} else if (!exactValues.annualGross.isZero()) {
					source = "annualGross";
					value = exactValues.annualGross.toString();
				} else if (!exactValues.monthlyNet.isZero()) {
					source = "monthlyNet";
					value = exactValues.monthlyNet.toString();
				} else if (!exactValues.hourlyNet.isZero()) {
					source = "hourlyNet";
					value = exactValues.hourlyNet.toString();
				} else if (!exactValues.annualNet.isZero()) {
					source = "annualNet";
					value = exactValues.annualNet.toString();
				} else {
					return;
				}

				updateAllFields(
					source as
						| "hourlyGross"
						| "monthlyGross"
						| "annualGross"
						| "hourlyNet"
						| "monthlyNet"
						| "annualNet",
					value,
				);
			}
		}
	}, [
		status,
		workTimePercentage,
		bonusMonths,
		sourceDeduction,
		updateAllFields,
		exactValues,
	]);

	const statusOptions: Array<{ label: string; value: Status }> = [
		{ label: "Salarié non-cadre", value: "non-cadre" },
		{ label: "Salarié cadre", value: "cadre" },
		{ label: "Fonction publique", value: "fonction-publique" },
		{ label: "Profession libérale", value: "profession-liberale" },
		{ label: "Portage salarial", value: "portage-salarial" },
	];

	const statusTooltips = generateStatusTooltips(deductionRates);

	const bonusMonthOptions = [12, 13, 14, 15, 16];

	const handleInputFocus = (fieldName: string) => {
		setFocusedInput(fieldName);
		// Store currently displayed formatted value as input value when focusing
		const currentValue = (() => {
			switch (fieldName) {
				case "hourlyGross":
					return exactValues.hourlyGross.isZero()
						? ""
						: formatHourlyRate(exactValues.hourlyGross.toNumber());
				case "monthlyGross":
					return exactValues.monthlyGross.isZero()
						? ""
						: roundToWhole(exactValues.monthlyGross.toNumber()).toString();
				case "annualGross":
					return exactValues.annualGross.isZero()
						? ""
						: roundToWhole(exactValues.annualGross.toNumber()).toString();
				case "hourlyNet":
					return exactValues.hourlyNet.isZero()
						? ""
						: formatHourlyRate(exactValues.hourlyNet.toNumber());
				case "monthlyNet":
					return exactValues.monthlyNet.isZero()
						? ""
						: roundToWhole(exactValues.monthlyNet.toNumber()).toString();
				case "annualNet":
					return exactValues.annualNet.isZero()
						? ""
						: roundToWhole(exactValues.annualNet.toNumber()).toString();
				default:
					return "";
			}
		})();
		setInputValues((prev) => ({ ...prev, [fieldName]: currentValue }));
	};

	const handleInputBlur = () => {
		setFocusedInput(null);
		setInputValues({});
	};

	const handleHourlyBlur = (fieldName: string, value: string) => {
		if (value.trim() !== "" && !Number.isNaN(parseFloat(value))) {
			// Format the value and trigger calculation
			const formattedValue = formatHourlyRate(parseFloat(value));
			updateAllFields(fieldName as "hourlyGross" | "hourlyNet", formattedValue);
		}
		setFocusedInput(null);
		setInputValues({});
	};

	const handleInputChange = (fieldName: string, value: string) => {
		setInputValues((prev) => ({ ...prev, [fieldName]: value }));
		if (value.trim() !== "" && !Number.isNaN(parseFloat(value))) {
			updateAllFields(
				fieldName as
					| "hourlyGross"
					| "monthlyGross"
					| "annualGross"
					| "hourlyNet"
					| "monthlyNet"
					| "annualNet",
				value,
			);
		}
	};

	const clearFields = () => {
		setMonthlyNetAfterTax("0");
		setAnnualNetAfterTax("0");
		setFocusedInput(null);
		setInputValues({});
		setExactValues({
			hourlyGross: new BigNumber(0),
			monthlyGross: new BigNumber(0),
			annualGross: new BigNumber(0),
			hourlyNet: new BigNumber(0),
			monthlyNet: new BigNumber(0),
			annualNet: new BigNumber(0),
			monthlyNetAfterTax: new BigNumber(0),
			annualNetAfterTax: new BigNumber(0),
		});
	};

	return (
		<View style={styles.safeArea}>
			<StatusBar backgroundColor="#e74c3c" barStyle="light-content" />
			<ScrollView
				style={[
					styles.container,
					{ paddingTop: isIOS ? 44 : statusBarHeight + 20 },
				]}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Salaire Brut En Net</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Indiquez votre salaire brut</Text>
					<Text style={styles.sectionTitle}>Résultat de votre salaire net</Text>
				</View>

				<View style={styles.inputRow}>
					<View style={styles.inputGroup}>
						<Text style={styles.labelText}>Horaire brut</Text>
						<TextInput
							style={styles.input}
							value={hourlyGross}
							onChangeText={(value) => handleInputChange("hourlyGross", value)}
							onFocus={() => handleInputFocus("hourlyGross")}
							onBlur={() =>
								handleHourlyBlur("hourlyGross", inputValues.hourlyGross || "")
							}
							keyboardType="numeric"
							placeholder="ex : 9.88"
							placeholderTextColor="#e74c3c"
						/>
					</View>
					<View style={styles.inputGroup}>
						<Text style={styles.labelText}>Horaire net</Text>
						<TextInput
							style={styles.input}
							value={hourlyNet}
							onChangeText={(value) => handleInputChange("hourlyNet", value)}
							onFocus={() => handleInputFocus("hourlyNet")}
							onBlur={() =>
								handleHourlyBlur("hourlyNet", inputValues.hourlyNet || "")
							}
							keyboardType="numeric"
							placeholder="Horaire"
							placeholderTextColor="#e74c3c"
						/>
					</View>
				</View>

				<View style={styles.inputRow}>
					<View style={styles.inputGroup}>
						<View style={styles.label}>
							<Text style={styles.labelText}>Mensuel brut</Text>
							<Text style={styles.badgeText}>{statusTooltips[status]}</Text>
						</View>
						<TextInput
							style={styles.input}
							value={monthlyGross}
							onChangeText={(value) => handleInputChange("monthlyGross", value)}
							onFocus={() => handleInputFocus("monthlyGross")}
							onBlur={handleInputBlur}
							keyboardType="numeric"
							placeholder="ex : 1498"
							placeholderTextColor="#e74c3c"
						/>
					</View>
					<View style={styles.inputGroup}>
						<Text style={styles.labelText}>Mensuel net</Text>
						<TextInput
							style={styles.input}
							value={monthlyNet}
							onChangeText={(value) => handleInputChange("monthlyNet", value)}
							onFocus={() => handleInputFocus("monthlyNet")}
							onBlur={handleInputBlur}
							keyboardType="numeric"
							placeholder="Mensuel"
							placeholderTextColor="#e74c3c"
						/>
					</View>
				</View>

				<View style={styles.inputRow}>
					<View style={styles.inputGroup}>
						<Text style={styles.labelText}>Annuel brut</Text>
						<TextInput
							style={styles.input}
							value={annualGross}
							onChangeText={(value) => handleInputChange("annualGross", value)}
							onFocus={() => handleInputFocus("annualGross")}
							onBlur={handleInputBlur}
							keyboardType="numeric"
							placeholder="ex : 17976"
							placeholderTextColor="#e74c3c"
						/>
					</View>
					<View style={styles.inputGroup}>
						<Text style={styles.labelText}>Annuel net</Text>
						<TextInput
							style={styles.input}
							value={annualNet}
							onChangeText={(value) => handleInputChange("annualNet", value)}
							onFocus={() => handleInputFocus("annualNet")}
							onBlur={handleInputBlur}
							keyboardType="numeric"
							placeholder="Annuel"
							placeholderTextColor="#e74c3c"
						/>
					</View>
				</View>

				<View style={styles.statusSection}>
					<Text style={styles.sectionTitle}>Sélectionnez votre statut :</Text>
					<View style={styles.statusOptions}>
						{statusOptions.map((option) => (
							<TouchableOpacity
								key={option.value}
								style={[
									styles.statusOption,
									status === option.value && styles.statusOptionSelected,
								]}
								onPress={() => {
									setStatus(option.value);
								}}
							>
								<View
									style={[
										styles.radio,
										status === option.value && styles.radioSelected,
									]}
								>
									{status === option.value && (
										<View style={styles.radioInner} />
									)}
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
						Sélectionnez votre temps de travail : {workTimePercentage}%
					</Text>
					<View style={styles.sliderContainer}>
						<Slider
							style={styles.slider}
							minimumValue={10}
							maximumValue={100}
							value={workTimePercentage}
							onValueChange={(value) => {
								setWorkTimePercentage(value);
							}}
							step={10}
							minimumTrackTintColor="#e74c3c"
							maximumTrackTintColor="#e0e0e0"
							thumbTintColor="#e74c3c"
						/>
					</View>
				</View>

				<View style={styles.bonusSection}>
					<Text style={styles.sectionTitle}>
						Sélectionnez le nombre de mois de prime conventionnelle:
					</Text>
					<View style={styles.bonusOptions}>
						{bonusMonthOptions.map((months) => (
							<TouchableOpacity
								key={months}
								style={[
									styles.bonusOption,
									bonusMonths === months && styles.bonusOptionSelected,
								]}
								onPress={() => {
									setBonusMonths(months);
								}}
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
						Sélectionnez le taux de prélèvement à la source:{" "}
						{sourceDeduction.toFixed(1)}%
					</Text>
					<View style={styles.sliderContainer}>
						<Slider
							style={styles.slider}
							minimumValue={0}
							maximumValue={100}
							value={sourceDeduction}
							onValueChange={(value) => {
								setSourceDeduction(value);
							}}
							step={0.5}
							minimumTrackTintColor="#e74c3c"
							maximumTrackTintColor="#e0e0e0"
							thumbTintColor="#e74c3c"
						/>
					</View>
				</View>

				<View style={styles.resultSection}>
					<Text style={styles.resultTitle}>
						Estimation de votre salaire net après le prélèvement à la source
					</Text>
					<View style={styles.resultRow}>
						<View style={styles.resultGroup}>
							<Text style={styles.resultLabel}>Mensuel net après impôts</Text>
							<TextInput
								style={styles.resultInput}
								value={monthlyNetAfterTax}
								editable={false}
							/>
						</View>
						<View style={styles.resultGroup}>
							<Text style={styles.resultLabel}>Annuel net après impôts</Text>
							<TextInput
								style={styles.resultInput}
								value={annualNetAfterTax}
								editable={false}
							/>
						</View>
					</View>
				</View>

				<TouchableOpacity style={styles.clearButton} onPress={clearFields}>
					<Text style={styles.clearButtonText}>Effacer les champs</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
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
	statusSection: {
		marginVertical: 20,
	},
	statusOptions: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 15,
		flexDirection: "row",
		flexWrap: "wrap",
	},
	statusOption: {
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 12,
		flex: 1,
	},
	statusOptionSelected: {},
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
	statusLabel: {
		color: "#2c3e50",
		fontSize: 12,
		textAlign: "center",
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
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 10,
		width: "20%",
	},
	bonusOptionSelected: {},
	bonusLabel: {
		color: "#2c3e50",
		fontSize: 12,
		textAlign: "center",
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
