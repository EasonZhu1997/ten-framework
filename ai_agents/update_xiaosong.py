import json

path = "/app/agents/examples/xiaosong/property.json"
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 修改小松的配置
for graph in data['_ten']['predefined_graphs']:
    if 'name' in graph:
        graph['name'] = 'xiaosong_voice_assistant'
    for node in graph.get('nodes', []):
        if node.get('name') == 'llm':
            node['property']['greeting'] = '嘿！我是小松，很高兴认识你！有什么我能帮到你的吗？'
            node['property']['prompt'] = '你是小松，一个友好、专业、有幽默感的AI助手。你的性格阳光开朗，说话简洁有力。你是男性AI，语气稳重但不失亲和力。'
            if 'base_url' not in node['property']:
                node['property']['base_url'] = '${env:OPENAI_API_BASE|}'
            if 'model' not in node['property']:
                node['property']['model'] = '${env:OPENAI_MODEL|gpt-4o}'

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("小松配置已更新")
