from fastapi import APIRouter
from fastapi import Depends
from app.auth.dependency import get_current_user

router = APIRouter()

@router.get("/translation")
def translation(
    current_user=Depends(get_current_user)
):
     return{
          "message": "Hello its translation Modeule!"
     }