"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Zap } from "lucide-react";
import { usePriceAnalysis, useWeeklyAverages, useMonthlyAverages } from "@/hooks/useElectricityData";
import { useResponsive } from "@/hooks/useResponsive";
import { PeriodFilter } from "../chart/PeriodFilter";
import { BarChart } from "../chart/BarChartRecharts";
import { LineChart } from "../chart/LineChartRecharts";
import { PieChart } from "../chart/PieChartRecharts";
import { ChartTypeSelector } from "../chart/ChartTypeSelector";
import { ChartLegend } from "../chart/ChartLegend";
import { PriceChartSkeleton, PriceChartError } from "../chart/ChartStates";
import { PeriodType, PriceData, ChartType } from "../chart/types";
import { generateDynamicLegend } from "../chart/legendUtils";
import { MonthlyBarChart } from '../chart/MonthlyBarChart';
import { MonthlyPieChart } from '../chart/MonthlyPieChart';

export function PriceChart() {
	const [activePeriod, setActivePeriod] = useState<PeriodType>("hoy");
	const [activeChartType, setActiveChartType] = useState<ChartType>("bar");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

	const { isMobile } = useResponsive();
	const effectiveChartType = isMobile ? "line" : activeChartType;

	// Hooks para cada período, todos usan datos agregados del backend
	const todayAnalysis = usePriceAnalysis(); // /prices/today
	// Eliminados weekPrices y monthPrices porque no se usan
	const weeklyAverages = useWeeklyAverages(); // /prices/weekly-averages
	const monthlyAverages = useMonthlyAverages(); // /prices/monthly-averages

	// Selección de datos según período
	let currentData, prices;
	if (activePeriod === "hoy") {
	  currentData = todayAnalysis;
	  prices = currentData.data?.prices ?? [];
	} else if (activePeriod === "semana") {
	  currentData = weeklyAverages;
	  prices = currentData.data ?? [];
	} else {
	  currentData = monthlyAverages;
	  prices = currentData.data ?? [];
	}

	const isPriceDataArray = (arr: unknown[]): arr is PriceData[] => arr.length === 0 || (typeof arr[0] === "object" && arr[0] !== null && "hour" in arr[0]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await currentData.refetch();
			setLastUpdated(new Date());
		} finally {
			setTimeout(() => setIsRefreshing(false), 500);
		}
	};

	const handlePeriodChange = (newPeriod: PeriodType) => {
		setActivePeriod(newPeriod);
		setTimeout(() => {
			document.querySelector(".chart-bg")?.classList.add("animate-chart-load");
		}, 100);
	};

	const handleChartTypeChange = (newType: ChartType) => {
		setActiveChartType(newType);
		setTimeout(() => {
			document.querySelector(".chart-bg")?.classList.add("animate-chart-load");
		}, 100);
	};

	const getStatusIndicator = () => {
		if (currentData.isLoading || isRefreshing) {
			return (
				<div className="flex items-center space-x-2 text-yellow-400">
					<div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
					<span className="text-xs">Actualizando...</span>
				</div>
			);
		}
		const timeDiff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000 / 60);
		const isRecent = timeDiff < 5;
		return (
			<div className={`flex items-center space-x-2 ${isRecent ? "text-green-400" : "text-slate-400"}`}>
				<div className={`w-2 h-2 rounded-full ${isRecent ? "bg-green-400" : "bg-slate-400"}`}></div>
				<span className="text-xs">{isRecent ? "Actualizado" : `Hace ${timeDiff}m`}</span>
			</div>
		);
	};

	if (currentData.isLoading && !isRefreshing) return <PriceChartSkeleton />;
	if (currentData.error) return <PriceChartError error={currentData.error} onRetry={handleRefresh} />;

	const dynamicLegend = generateDynamicLegend(prices, activePeriod, effectiveChartType);

	const renderChart = () => {
		// Helpers para transformar datos
			const getWeekDays = () => ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
			const transformWeekly = (data: { week: number; avgPrice: number }[]): { price: number | null; date: string }[] => {
				const weekDays = getWeekDays();
				return weekDays.map((day, idx) => {
					const found = data.find((d: { week: number; avgPrice: number }) => d.week === idx + 1);
					return {
						price: found ? found.avgPrice : null,
						date: day
					};
				});
			};
			const getMonths = () => ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
			const transformMonthly = (data: { month: number; avgPrice: number }[]): { price: number | null; date: string }[] => {
				const months = getMonths();
				return months.map((month, idx) => {
					const found = data.find((d: { month: number; avgPrice: number }) => d.month === idx + 1);
					return {
						price: found ? found.avgPrice : null,
						date: month
					};
				});
			};

			if (effectiveChartType === "bar") {
				if (activePeriod === "semana" && Array.isArray(prices) && prices.length > 0 && 'week' in prices[0]) {
					return <BarChart prices={transformWeekly(prices as { week: number; avgPrice: number }[])} period={activePeriod} />;
				}
				if (activePeriod === "mes") return <MonthlyBarChart />;
				return isPriceDataArray(prices) ? <BarChart prices={prices as PriceData[]} period={activePeriod} /> : null;
			}
			if (effectiveChartType === "line") {
				if (activePeriod === "semana" && Array.isArray(prices) && prices.length > 0 && 'week' in prices[0]) {
					return <LineChart prices={transformWeekly(prices as { week: number; avgPrice: number }[])} period={activePeriod} />;
				}
				if (activePeriod === "mes" && Array.isArray(prices) && prices.length > 0 && 'month' in prices[0]) {
					return <LineChart prices={transformMonthly(prices as { month: number; avgPrice: number }[])} period={activePeriod} />;
				}
				return isPriceDataArray(prices) ? <LineChart prices={prices as PriceData[]} period={activePeriod} /> : null;
			}
			if (effectiveChartType === "pie") {
				if (activePeriod === "mes") return <MonthlyPieChart />;
				return isPriceDataArray(prices) ? <PieChart prices={prices as PriceData[]} period={activePeriod} /> : null;
			}
			return <div className="text-center text-slate-400">No hay datos compatibles para el gráfico</div>;
	};

	// Título y descripción
	const getTitle = () => {
		switch (activePeriod) {
			case "hoy":
				return "Precio de la Luz - Hoy";
			case "semana":
				return "Precio de la Luz - Por Semanas";
			case "mes":
				return "Precio de la Luz - Por Meses";
			default:
				return "Precio de la Luz";
		}
	};
	const getDescription = () => {
		switch (activePeriod) {
			case "hoy":
				return "Datos en tiempo real - OMIE";
			case "semana":
				return "Promedio por dia de la semana actual";
			case "mes":
				return "Promedio de cada mes del año actual";
			default:
				return "Datos de electricidad";
		}
	};

	return (
		<Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl w-full">
			<CardHeader className={`${isMobile ? "p-3" : "p-4 sm:p-6"}`}>
				<div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center ${isMobile ? "mb-3" : "mb-6"} space-y-4 sm:space-y-0`}>
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
							<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
						</div>
						<div>
							<CardTitle className="text-white text-lg sm:text-xl flex items-center space-x-2">
								<span>{getTitle()}</span>
								{activePeriod === "hoy" && <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
							</CardTitle>
							<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
								<p className="text-slate-300 text-xs sm:text-sm">{getDescription()}</p>
								{getStatusIndicator()}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-6">
					{/* Filtro de período */}
					<div className="w-full md:w-auto md:flex-1">
						<PeriodFilter activePeriod={activePeriod} onPeriodChange={handlePeriodChange} />
					</div>
					{/* Selector de tipo de gráfico - Oculto en móvil */}
					{!isMobile && (
						<div className="w-full md:w-auto md:flex-shrink-0">
							<ChartTypeSelector activeType={activeChartType} onTypeChange={handleChartTypeChange} />
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className={`${isMobile ? "p-2" : "p-4 sm:p-2"}`}>
				{/* Gráfico dinámico con animaciones */}
				<div className={`chart-bg bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 rounded-xl border border-slate-400/10 shadow-2xl backdrop-blur-md transition-all duration-300 ${isMobile ? "p-1 mb-4" : "p-2 mb-6"}`}>
					{renderChart()}
				</div>
				{/* Leyenda dinámica - Oculta en móvil para dar más espacio al gráfico */}
				{!isMobile && (
					<div className="flex justify-center items-center p-3">
								{/* ChartLegend solo acepta PriceData[] */}
								{isPriceDataArray(prices) && (
									<ChartLegend legend={dynamicLegend} prices={prices} />
								)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
