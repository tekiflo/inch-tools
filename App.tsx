import { View } from "react-native";
import SalaryCalculator from "./components/SalaryCalculator";

export default function App() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<SalaryCalculator />
		</View>
	);
}
