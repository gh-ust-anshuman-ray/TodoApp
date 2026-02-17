from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from .. import models, schemas, database
from ..dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=schemas.TaskOut)
def create_task(
    task: schemas.TaskCreate = Body(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    max_order = db.query(models.Task).filter(models.Task.owner_id == current_user.id).count()
    db_task = models.Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        order=max_order,
        owner_id=current_user.id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(
    status: Optional[str] = Query(default=None),
    upcoming: Optional[bool] = Query(default=False),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Task).filter(models.Task.owner_id == current_user.id)
    if status:
        query = query.filter(models.Task.status == status)
    if upcoming:
        query = query.filter(models.Task.due_date > datetime.utcnow())
    return query.order_by(models.Task.order).all()

@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: int, db: Session = Depends(database.get_db)
, current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task



@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(
    task_id: int,
    updated: schemas.TaskUpdate = Body(..., embed=True),  # 👈 Add embed=True
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in updated.dict(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task




@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(database.get_db)
, current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}


@router.post("/reorder")
def reorder_tasks(
    orders: List[int] = Body(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    id_to_task = {task.id: task for task in tasks}

    # ✅ Validate only the incoming task IDs
    for task_id in orders:
        if task_id not in id_to_task:
            raise HTTPException(status_code=400, detail=f"Invalid task ID: {task_id}")

    # ✅ Reorder only the tasks in the `orders` list
    for idx, task_id in enumerate(orders):
        id_to_task[task_id].order = idx

    db.commit()
    return {"message": "Tasks reordered"}
