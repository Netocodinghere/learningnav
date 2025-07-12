from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import tempfile

app = FastAPI()

prompt = PromptTemplate(
    input_variables=["text"],
    template="""
Given the following content, generate 3 multiple-choice quiz questions with 4 answer choices.
Mark the correct answer with an asterisk (*).

Content:
{text}

Questions:
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
