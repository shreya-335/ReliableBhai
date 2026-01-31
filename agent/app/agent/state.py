import operator
from typing import Annotated, List, Union, Dict, Any
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    # 'messages' holds the full chat history (User input, AI thoughts, Tool outputs)
    # operator.add ensures new messages are appended, not overwritten
    messages: Annotated[List[BaseMessage], operator.add]
    
    # 'final_output' will store the structured Pydantic object at the end
    final_output: Dict[str, Any]