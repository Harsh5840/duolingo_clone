from __future__ import annotations

import json
from datetime import date, datetime, timedelta

from sqlalchemy.orm import Session

from .db import Base, SessionLocal, engine
from .models import (
    Achievement,
    Course,
    Exercise,
    Lesson,
    Skill,
    Unit,
    User,
    UserSkillProgress,
    XpEvent,
)

# (type, prompt, answer, payload)
EX = {
    "greetings": [
        ("multiple_choice", "Select the Spanish for “hello”.", "Hola", {"options": ["Hola", "Adiós", "Gracias"]}),
        ("word_bank", "Translate: Hello", "Hola", {"bank": ["Hola", "Adiós", "Por", "favor"]}),
        ("match_pairs", "Tap the matching pairs", "", {"pairs": [["Hola", "Hello"], ["Adiós", "Goodbye"], ["Gracias", "Thanks"]]}),
        ("fill_blank", "Complete: ___ días", "Buenos", {"sentence": "___ días", "options": ["Buenos", "Malos", "Grandes"]}),
        ("type_answer", "Type the Spanish for “please”.", "Por favor", {"hint": "two words"}),
        ("multiple_choice", "What does “Gracias” mean?", "Thank you", {"options": ["Thank you", "Please", "Sorry"]}),
        ("word_bank", "Translate: Good morning", "Buenos días", {"bank": ["Buenos", "días", "noches", "Adiós"]}),
        ("type_answer", "Type “goodbye” in Spanish.", "Adiós", {}),
    ],
    "phrases": [
        ("multiple_choice", "Select “How are you?”", "¿Cómo estás?", {"options": ["¿Cómo estás?", "Me llamo", "Mucho gusto"]}),
        ("word_bank", "Translate: My name is Ana", "Me llamo Ana", {"bank": ["Me", "llamo", "Ana", "estoy", "soy"]}),
        ("match_pairs", "Match the phrases", "", {"pairs": [["Me llamo", "My name is"], ["Mucho gusto", "Nice to meet you"], ["¿Cómo estás?", "How are you?"]]}),
        ("fill_blank", "Complete: Me ___ Luis", "llamo", {"sentence": "Me ___ Luis", "options": ["llamo", "estoy", "tengo"]}),
        ("type_answer", "Type “nice to meet you” in Spanish.", "Mucho gusto", {}),
        ("multiple_choice", "“Estoy bien” means…", "I am well", {"options": ["I am well", "I am hungry", "See you"]}),
        ("word_bank", "Translate: I am well", "Estoy bien", {"bank": ["Estoy", "bien", "mal", "Hola"]}),
        ("type_answer", "Type “I am” (temporary) in Spanish.", "Estoy", {}),
    ],
    "food": [
        ("multiple_choice", "Select the Spanish for “water”.", "agua", {"options": ["agua", "pan", "leche"]}),
        ("word_bank", "Translate: I want coffee", "Quiero café", {"bank": ["Quiero", "café", "agua", "pan"]}),
        ("match_pairs", "Match the foods", "", {"pairs": [["manzana", "apple"], ["pan", "bread"], ["café", "coffee"]]}),
        ("fill_blank", "Complete: Quiero ___", "agua", {"sentence": "Quiero ___", "options": ["agua", "correr", "azul"]}),
        ("type_answer", "Type “bread” in Spanish.", "pan", {}),
        ("multiple_choice", "“Manzana” is a…", "apple", {"options": ["apple", "banana", "cheese"]}),
        ("word_bank", "Translate: The apple", "La manzana", {"bank": ["La", "manzana", "El", "pan"]}),
        ("type_answer", "Type “I want” in Spanish.", "Quiero", {}),
    ],
    "directions": [
        ("multiple_choice", "Select “left”.", "izquierda", {"options": ["izquierda", "derecha", "recto"]}),
        ("word_bank", "Translate: Turn right", "Gira a la derecha", {"bank": ["Gira", "a", "la", "derecha", "izquierda"]}),
        ("match_pairs", "Match directions", "", {"pairs": [["izquierda", "left"], ["derecha", "right"], ["recto", "straight"]]}),
        ("fill_blank", "Complete: Sigue ___", "recto", {"sentence": "Sigue ___", "options": ["recto", "manzana", "gracias"]}),
        ("type_answer", "Type “where” in Spanish.", "dónde", {}),
        ("multiple_choice", "“¿Dónde está?” means…", "Where is it?", {"options": ["Where is it?", "Who is it?", "How much?"]}),
        ("word_bank", "Translate: Where is the cafe?", "¿Dónde está el café?", {"bank": ["¿Dónde", "está", "el", "café?", "la"]}),
        ("type_answer", "Type “straight” in Spanish.", "recto", {}),
    ],
    "cafe": [
        ("multiple_choice", "Ask for the bill.", "La cuenta, por favor", {"options": ["La cuenta, por favor", "Buenos días", "Estoy bien"]}),
        ("word_bank", "Translate: A table for two", "Una mesa para dos", {"bank": ["Una", "mesa", "para", "dos", "tres"]}),
        ("match_pairs", "Match cafe words", "", {"pairs": [["camarero", "waiter"], ["mesa", "table"], ["cuenta", "bill"]]}),
        ("fill_blank", "Complete: Una ___ para dos", "mesa", {"sentence": "Una ___ para dos", "options": ["mesa", "manzana", "calle"]}),
        ("type_answer", "Type “waiter” in Spanish.", "camarero", {}),
        ("multiple_choice", "“El menú” means…", "the menu", {"options": ["the menu", "the train", "the house"]}),
        ("word_bank", "Translate: The coffee, please", "El café, por favor", {"bank": ["El", "café,", "por", "favor", "agua"]}),
        ("type_answer", "Type “the bill” in Spanish.", "la cuenta", {}),
    ],
    "family": [
        ("multiple_choice", "Select “mother”.", "madre", {"options": ["madre", "padre", "hermano"]}),
        ("word_bank", "Translate: My father", "Mi padre", {"bank": ["Mi", "padre", "madre", "El"]}),
        ("match_pairs", "Match family", "", {"pairs": [["madre", "mother"], ["padre", "father"], ["hermana", "sister"]]}),
        ("fill_blank", "Complete: Mi ___ es Ana", "hermana", {"sentence": "Mi ___ es Ana", "options": ["hermana", "café", "calle"]}),
        ("type_answer", "Type “brother” in Spanish.", "hermano", {}),
        ("multiple_choice", "“Hijo” means…", "son", {"options": ["son", "uncle", "dog"]}),
        ("word_bank", "Translate: I have a sister", "Tengo una hermana", {"bank": ["Tengo", "una", "hermana", "un", "hermano"]}),
        ("type_answer", "Type “family” in Spanish.", "familia", {}),
    ],
    "descriptions": [
        ("multiple_choice", "Select “big”.", "grande", {"options": ["grande", "pequeño", "alto"]}),
        ("word_bank", "Translate: A small cat", "Un gato pequeño", {"bank": ["Un", "gato", "pequeño", "grande", "una"]}),
        ("match_pairs", "Match adjectives", "", {"pairs": [["grande", "big"], ["pequeño", "small"], ["bonito", "pretty"]]}),
        ("fill_blank", "Complete: El perro es ___", "grande", {"sentence": "El perro es ___", "options": ["grande", "cuenta", "izquierda"]}),
        ("type_answer", "Type “pretty” in Spanish.", "bonito", {}),
        ("multiple_choice", "“Alto” means…", "tall", {"options": ["tall", "red", "slow"]}),
        ("word_bank", "Translate: She is tall", "Ella es alta", {"bank": ["Ella", "es", "alta", "alto", "El"]}),
        ("type_answer", "Type “small” in Spanish.", "pequeño", {}),
    ],
}

UNITS = [
    (1, "Order in a cafe", "Greet people and ask for food", "#58CC02", [
        ("Greetings", "Say hello and goodbye", "chat", "greetings"),
        ("Phrases", "Introduce yourself", "speech", "phrases"),
        ("Food", "Order something to eat", "apple", "food"),
    ]),
    (2, "Get around", "Ask for directions and sit down", "#1CB0F6", [
        ("Directions", "Turn left, go straight", "map", "directions"),
        ("Cafe", "Tables, waiters, the bill", "mug", "cafe"),
    ]),
    (3, "People", "Talk about family and looks", "#CE82FF", [
        ("Family", "Parents and siblings", "home", "family"),
        ("Descriptions", "Big, small, pretty, tall", "star", "descriptions"),
    ]),
]

ACHIEVEMENTS = [
    ("first_lesson", "First step", "Finish your first lesson", "owl"),
    ("streak_3", "On fire", "Reach a 3-day streak", "fire"),
    ("xp_100", "Century", "Earn 100 XP", "zap"),
    ("perfect_lesson", "Flawless", "Finish a lesson with no mistakes", "crown"),
    ("legendary", "Legendary", "Beat a legendary challenge", "trophy"),
]


def _add_exercises(db: Session, lesson: Lesson, rows: list, take: int) -> None:
    for i, (typ, prompt, answer, payload) in enumerate(rows[:take]):
        db.add(
            Exercise(
                lesson=lesson,
                index=i,
                type=typ,
                prompt=prompt,
                prompt_language="en",
                answer=answer,
                payload=json.dumps(payload),
            )
        )


def seed(db: Session) -> None:
    if db.query(User).first():
        return

    course = Course(
        code="es-en",
        name="Spanish",
        from_language="English",
        to_language="Spanish",
    )
    db.add(course)

    for u_index, title, desc, color, skills in UNITS:
        unit = Unit(course=course, index=u_index, title=title, description=desc, color=color)
        db.add(unit)
        for s_index, (sname, sdesc, icon, key) in enumerate(skills, start=1):
            skill = Skill(unit=unit, index=s_index, name=sname, description=sdesc, icon=icon)
            db.add(skill)
            rows = EX[key]
            for li in range(2):
                lesson = Lesson(skill=skill, index=li, kind="standard", xp_reward=10)
                db.add(lesson)
                rotated = rows[li:] + rows[:li]
                _add_exercises(db, lesson, rotated, 6)
            legendary = Lesson(skill=skill, index=0, kind="legendary", xp_reward=20)
            db.add(legendary)
            _add_exercises(db, legendary, rows, 5)

    for code, name, desc, icon in ACHIEVEMENTS:
        db.add(Achievement(code=code, name=name, description=desc, icon=icon))

    now = datetime.utcnow()
    you = User(
        username="luna",
        display_name="Luna",
        avatar="owl",
        xp=120,
        gems=350,
        hearts=4,
        hearts_updated_at=now,
        streak=3,
        last_activity_date=date.today() - timedelta(days=1),
        daily_goal_xp=20,
        theme="light",
    )
    db.add(you)
    db.flush()

    first_skill = db.query(Skill).join(Unit).order_by(Unit.index, Skill.index).first()
    db.add(UserSkillProgress(user_id=you.id, skill_id=first_skill.id, crowns=1, legendary_complete=False))
    db.add(XpEvent(user_id=you.id, amount=120, source="seed", day=date.today() - timedelta(days=1)))

    rivals = [
        ("diego", "Diego", 980),
        ("sofia", "Sofía", 760),
        ("marco", "Marco", 540),
        ("elena", "Elena", 410),
        ("pablo", "Pablo", 290),
        ("carla", "Carla", 180),
        ("nino", "Nino", 95),
        ("iris", "Iris", 40),
    ]
    for uname, dname, xp in rivals:
        db.add(
            User(
                username=uname,
                display_name=dname,
                avatar="duo",
                xp=xp,
                gems=50,
                hearts=5,
                hearts_updated_at=now,
                streak=2,
                last_activity_date=date.today(),
                daily_goal_xp=20,
            )
        )

    db.commit()


def reset_and_seed() -> None:
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    reset_and_seed()
    print("seeded")
