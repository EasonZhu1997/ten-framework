import * as React from "react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import {
  setSelectedGraphId,
} from "@/store/reducers/global"
import { cn } from "@/lib/utils"


export function RemoteGraphSelect() {
  const dispatch = useAppDispatch()
  const graphName = useAppSelector((state) => state.global.selectedGraphId)
  const agentConnected = useAppSelector((state) => state.global.agentConnected)

  // 硬编码小松的配置
  const xiaosongGraph = {
    label: "小松 AI 助手",
    value: "xiaosong_voice_assistant",
    uuid: "xiaosong_voice_assistant",
  }

  // 组件挂载时自动选择小松
  React.useEffect(() => {
    if (!graphName) {
      dispatch(setSelectedGraphId(xiaosongGraph.value))
    }
  }, [])

  const onSelectXiaosong = () => {
    dispatch(setSelectedGraphId(xiaosongGraph.value))
  }

  const isSelected = graphName === xiaosongGraph.value || !graphName

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={onSelectXiaosong}
          disabled={agentConnected}
          variant={isSelected ? "default" : "outline"}
          className={cn(
            "min-w-[120px]",
            isSelected && "bg-primary text-primary-foreground"
          )}
        >
          {xiaosongGraph.label}
        </Button>
        <span className="text-xs text-muted-foreground self-center">
          {isSelected ? "✓ 已选择" : "点击选择"}
        </span>
      </div>
    </>
  )
}
