// 'use client'

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { CheckCircle2, AlertTriangle, Clock, Lightbulb } from 'lucide-react'
// import { PriceRecommendation } from '@/types/api'

// interface RecommendationsProps {
//   recommendations?: PriceRecommendation[]
// }

// interface RecommendationCard {
//   type: 'ideal' | 'avoid' | 'schedule'
//   title: string
//   description: string
//   timeRange: string
//   percentage: string
//   percentageColor: string
//   icon: React.ReactNode
//   bgColor: string
//   borderColor: string
// }

// export function Recommendations({ recommendations: _recommendations }: RecommendationsProps) {
//   // Datos predeterminados para coincidir con la imagen
//   const defaultRecommendations: RecommendationCard[] = [
//     {
//       type: 'ideal',
//       title: 'Momento ideal',
//       description: 'Pon la lavadora ahora',
//       timeRange: 'Próximas 2 horas',
//       percentage: '40%',
//       percentageColor: 'text-emerald-400',
//       icon: <CheckCircle2 className="w-5 h-5 text-white" />,
//       bgColor: 'bg-emerald-600/20',
//       borderColor: 'border-emerald-500/30'
//     },
//     {
//       type: 'avoid',
//       title: 'Evita usar ahora',
//       description: 'Lavavajillas y secadora',
//       timeRange: '18:00 - 22:00',
//       percentage: '',
//       percentageColor: '',
//       icon: <AlertTriangle className="w-5 h-5 text-white" />,
//       bgColor: 'bg-red-600/20',
//       borderColor: 'border-red-500/30'
//     },
//     {
//       type: 'schedule',
//       title: 'Programa para',
//       description: 'Carga del coche eléctrico',
//       timeRange: '02:00 - 06:00',
//       percentage: '60%',
//       percentageColor: 'text-blue-400',
//       icon: <Clock className="w-5 h-5 text-white" />,
//       bgColor: 'bg-blue-600/20',
//       borderColor: 'border-blue-500/30'
//     }
//   ]

//   const getIconBgColor = (type: string) => {
//     switch (type) {
//       case 'ideal': return 'bg-emerald-600'
//       case 'avoid': return 'bg-red-600'
//       case 'schedule': return 'bg-blue-600'
//       default: return 'bg-gray-600'
//     }
//   }

//   return (
//     <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
//       <CardHeader>
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
//             <Lightbulb className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <CardTitle className="text-white">Recomendaciones</CardTitle>
//             <p className="text-slate-400 text-sm">Inteligencia energética</p>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         {defaultRecommendations.map((rec, index) => (
//           <div key={index} className={`p-4 rounded-xl border ${rec.bgColor} ${rec.borderColor} transition-all hover:bg-opacity-80`}>
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-center space-x-3">
//                 <div className={`w-8 h-8 rounded-lg ${getIconBgColor(rec.type)} flex items-center justify-center`}>
//                   {rec.icon}
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-white text-sm">
//                     {rec.title}
//                   </h4>
//                   <p className="text-slate-300 text-sm">
//                     {rec.description}
//                   </p>
//                 </div>
//               </div>
//               {rec.percentage && (
//                 <div className={`text-lg font-bold ${rec.percentageColor}`}>
//                   {rec.percentage}
//                 </div>
//               )}
//             </div>
            
//             <div className="flex items-center text-slate-400 text-xs">
//               <Clock className="w-3 h-3 mr-1" />
//               {rec.timeRange}
//             </div>
//           </div>
//         ))}

//         {/* Consejo del día */}
//         <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mt-6">
//           <div className="flex items-start space-x-3">
//             <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <Lightbulb className="w-3 h-3 text-white" />
//             </div>
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <span className="text-blue-400 font-medium text-sm">Consejo del día</span>
//               </div>
//               <p className="text-slate-300 text-sm leading-relaxed">
//                 Usar electrodomésticos entre las 2:00 y 6:00 AM puede ahorrarte hasta un 60% en tu factura eléctrica.
//               </p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }