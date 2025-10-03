import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface SectionCardData {
  id: string
  title: string
  description: string
  value: string | number
  trend: {
    value: number
    isPositive: boolean
  }
  footer: {
    primary: string
    secondary: string
  }
}

interface SectionCardsProps {
  data: SectionCardData[]
  className?: string
}

export function SectionCards({ data = [], className }: SectionCardsProps) {
  const TrendIcon = ({ isPositive }: { isPositive: boolean }) => {
    return isPositive ? (
      <IconTrendingUp className="size-4" />
    ) : (
      <IconTrendingDown className="size-4" />
    )
  }

  const formatTrendValue = (value: number, isPositive: boolean) => {
    return value > 0 ? `${isPositive ? '+' : '-'}${(value).toFixed(2)}%` : `${(value).toFixed(2)}%`
  }

  return (
    <div className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ${className || ''}`}>
      {data.map((card) => (
        <Card key={card.id} className="@container/card">
          <CardHeader>
            <CardDescription>{card.description}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl whitespace-nowrap">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline"
              className={`${card.trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
              >
                <TrendIcon isPositive={card.trend.isPositive} />
                {formatTrendValue(card.trend.value, card.trend.isPositive)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footer.primary} <TrendIcon isPositive={card.trend.isPositive} />
            </div>
            <div className="text-muted-foreground">
              {card.footer.secondary}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
