from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.output_parsers.json import SimpleJsonOutputParser
import os
import tempfile
from pydantic import BaseModel
from typing import Optional, List, Dict, Union

class QuizQuestion(BaseModel):
    question: str
    options: Optional[Dict[str, str]] = None
    answer: Optional[Union[str, List[str]]] = None


app = FastAPI()

prompt = PromptTemplate(
    input_variables=["text", "number"],
    template="""
Given the following content, generate {number} questions split in a ratio of 3:2:1 for multiple-choice, single-choice, and open-ended questions respectively.

For multiple-choice and single-choice questions:
- Provide the question text.
- Provide 4 answer options labeled A, B, C, and D.
- Mark the correct answer(s) by including them in the "answer" field.
  - For multiple-choice questions, "answer" should be a list of all correct options.
  - For single-choice questions, "answer" should be a single option.
- Return the question as a JSON object with the fields:  
  ```json
  {{
    "question": "question text",
    "options": {{
      "A": "option text",
      "B": "option text",
      "C": "option text",
      "D": "option text"
    }},
    "answer": ["A", "C"]  // example for multichoice, or ["B"] for single-choice
  }}
  For open-ended questions:
  Provide the question text only.
  Return as a JSON object with only the "question" field. Do NOT include "options" or "answer".

Content:
{text}

Return only a JSON array of these question objects as your output.
"""
)
def load_and_chunk(file_path):
    if file_path.endswith(".pdf"):
        loader = PyPDFLoader(file_path)
    elif file_path.endswith(".docx"):
        loader = Docx2txtLoader(file_path)
    elif file_path.endswith(".txt"):
        loader = TextLoader(file_path)
    else:
        raise ValueError("Unsupported format")
    
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return splitter.split_documents(docs)

def generate_questions(chunks):
    llm = ChatOpenAI(model_name="gpt-4", temperature=0.3)
    chain = LLMChain(llm=llm, prompt=prompt)

    results = []
    for chunk in chunks:
        result = chain.run(chunk.page_content)
        results.append(result)
    output_parser = SimpleJsonOutputParser(pydantic_object=QuizQuestion)
    results = output_parser.parse_results(results)
    return results

@app.post("/api/generate-quiz")
async def generate_quiz(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        chunks = load_and_chunk(tmp_path)
        questions = generate_questions(chunks)
        return JSONResponse(content={"questions": questions})
    finally:
        os.remove(tmp_path)
