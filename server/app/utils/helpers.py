from flask import g, make_response
from flask_jwt_extended import (
    get_jwt_identity,
    create_refresh_token,
    create_access_token,
    get_jwt,
)
from datetime import timedelta, datetime
from ..models.db_utils import get_item_by_id, create_item
from ..models import User, Category, Property
import random
import uuid
import bcrypt
from flask import render_template
from weasyprint import HTML


def response(msg: str, data=None, success=True):
    return {"message": msg, "data": data, "success": success}


def get_logged_in_user():
    user_id = get_jwt_identity()
    # Get role from JWT claims
    role = get_jwt().get("role")

    user = get_item_by_id(g.session, User, user_id)  # Convert to int if needed
    return user.id, user.to_dict(), role


def generate_tokens(user):
    accessToken = create_access_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"], "firstName": user['firstName']},
        expires_delta=timedelta(days=1),
        fresh=True,
    )
    refreshToken = create_refresh_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(days=7),
    )
    return accessToken, refreshToken


def map_func(seq, func):
    """Emulates Javascript's map array method"""
    res = []
    for index, item in enumerate(seq):
        res.append(func(item, index, seq))
    return res


def filter_func(seq, func):
    """Emulates Javascript's filter array method"""
    res = []
    for index, item in enumerate(seq):
        if func(item, index, seq):
            res.append(item)
    return res


def dict_except(obj, *unused):
    new_obj = {**obj}
    for key in obj.keys():
        if key in unused:
            del new_obj[key]
    return new_obj


def serialize(item_list):
    if isinstance(item_list, list):
        return [item.to_dict() for item in item_list]
    elif item_list is not None:
        return item_list.to_dict()
    else:
        return None


def seed_categories(session):
    categories = [
        {"name": "Apartment"},
        {"name": "Self-Contained / Studio / Mini-Flat"},
        {"name": "Duplex"},
        {"name": "Bungalow"},
        {"name": "Detached / Semi-Detached"},
        {"name": "Serviced Apartment / Condo"},
        {"name": "Boys' Quarters (BQ)"},
        {"name": "Shared Apartment / Co-Living"},
        {"name": "Hostel / Student Housing"},
        {"name": "Short-Let"},
        {"name": "Office Space"},
        {"name": "Shop / Store"},
        {"name": "Co-Office Space"},
        {"name": "Warehouse / Industrial Space"},
        {"name": "Lodge / Guest House"},
        {"name": "Land (Residential / Commercial / Agricultural)"},
    ]
    for cat in categories:
        exists = session.query(Category).filter_by(name=cat["name"]).first()
        if not exists:
            create_item(session, Category, cat)
    session.commit()


def seed_properties(session):
    # 1. Fetch all available landlords from the DB
    landlords = session.query(User).filter_by(role="landlord", is_active=True).all()

    if not landlords:
        print("Error: No landlords found in the database. Please seed users first!")
        return

    landlord_ids = [l.id for l in landlords]
    print(f"Found {len(landlord_ids)} landlords. Distributing properties...")

    property_templates = [
        # --- LAGOS ---
        {
            "name": "Eko Atlantic Sky-Villa",
            "cat_name": "Apartment",  # Changed from Penthouse
            "area": "Victoria Island",
            "city": "Lagos",
            "state": "Lagos",
            "address": "Avenue 1, Eko Atlantic City",
            "price": 25000000,
            "type": "rent",
            "beds": 4,
            "landmark": "Eko Pearl Towers",
            "lat": 6.4211,
            "lng": 3.4179,
            "img": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        },
        {
            "name": "Lekki Phase 1 Terrace",
            "cat_name": "Serviced Apartment / Condo",
            "area": "Lekki",
            "city": "Lagos",
            "state": "Lagos",
            "address": "Admiralty Way, Lekki Phase 1",
            "price": 7000000,
            "type": "rent",
            "beds": 3,
            "landmark": "Lekki-Ikoyi Link Bridge",
            "lat": 6.4478,
            "lng": 3.4723,
            "img": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        },
        {
            "name": "Ikoyi Luxury Studio",
            "cat_name": "Self-Contained / Studio / Mini-Flat",
            "area": "Ikoyi",
            "city": "Lagos",
            "state": "Lagos",
            "address": "Bourdillon Road, Ikoyi",
            "price": 4000000,
            "type": "rent",
            "beds": 1,
            "landmark": "Banana Island Gate",
            "lat": 6.4531,
            "lng": 3.4331,
            "img": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        },
        {
            "name": "Ikeja GRA Office Complex",
            "cat_name": "Office Space",
            "area": "Ikeja",
            "city": "Lagos",
            "state": "Lagos",
            "address": "Joel Ogunnaike Street, GRA",
            "price": 12000000,
            "type": "rent",
            "beds": 0,
            "landmark": "Ikeja City Mall",
            "lat": 6.5891,
            "lng": 3.3582,
            "img": "https://images.unsplash.com/photo-1497366216548-37526070297c",
        },
        # --- ABUJA ---
        {
            "name": "Maitama Heights Mansion",
            "cat_name": "Detached / Semi-Detached", # Changed from Mansion
            "area": "Maitama",
            "city": "Abuja",
            "state": "FCT",
            "address": "Gana Street, Maitama",
            "price": 35000000,
            "type": "rent",
            "beds": 6,
            "landmark": "Transcorp Hilton",
            "lat": 9.0778,
            "lng": 7.4988,
            "img": "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
        },
        {
            "name": "Asokoro Executive Duplex",
            "cat_name": "Duplex",
            "area": "Asokoro",
            "city": "Abuja",
            "state": "FCT",
            "address": "Nelson Mandela Street, Asokoro",
            "price": 15000000,
            "type": "rent",
            "beds": 5,
            "landmark": "Aso Rock",
            "lat": 9.0345,
            "lng": 7.5122,
            "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        },
        {
            "name": "Gwarinpa Family Bungalow",
            "cat_name": "Bungalow",
            "area": "Gwarinpa",
            "city": "Abuja",
            "state": "FCT",
            "address": "3rd Avenue, Gwarinpa Estate",
            "price": 3500000,
            "type": "rent",
            "beds": 4,
            "landmark": "Gwarinpa Market",
            "lat": 9.1095,
            "lng": 7.4042,
            "img": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        },
        {
            "name": "Jabi Lake View Apartment",
            "cat_name": "Apartment",
            "area": "Jabi",
            "city": "Abuja",
            "state": "FCT",
            "address": "Alex Ekwueme Way, Jabi",
            "price": 5000000,
            "type": "rent",
            "beds": 3,
            "landmark": "Jabi Lake Mall",
            "lat": 9.0722,
            "lng": 7.4222,
            "img": "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        },
        # --- PORT HARCOURT ---
        {
            "name": "PH GRA Phase 2 Duplex",
            "cat_name": "Duplex",
            "area": "GRA Phase 2",
            "city": "Port Harcourt",
            "state": "Rivers",
            "address": "Tombia Street, GRA",
            "price": 6000000,
            "type": "rent",
            "beds": 4,
            "landmark": "Polo Club",
            "lat": 4.8196,
            "lng": 7.0051,
            "img": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
        },
        {
            "name": "Trans-Amadi Warehouse",
            "cat_name": "Warehouse / Industrial Space",
            "area": "Trans-Amadi",
            "city": "Port Harcourt",
            "state": "Rivers",
            "address": "Trans-Amadi Industrial Layout",
            "price": 20000000,
            "type": "rent",
            "beds": 0,
            "landmark": "Slaughter Bridge",
            "lat": 4.8021,
            "lng": 7.0344,
            "img": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
        },
        # --- ANAMBRA ---
        {
            "name": "Awka Millennium City Villa",
            "cat_name": "Detached / Semi-Detached", # Changed from Villa
            "area": "Awka",
            "city": "Awka",
            "state": "Anambra",
            "address": "Millennium City Estate, Awka",
            "price": 8500000,
            "type": "rent",
            "beds": 5,
            "landmark": "Governor's Lodge",
            "lat": 6.2105,
            "lng": 7.0691,
            "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        },
        {
            "name": "Onitsha Commercial Shop",
            "cat_name": "Shop / Store",
            "area": "Main Market",
            "city": "Onitsha",
            "state": "Anambra",
            "address": "Bright Street, Main Market",
            "price": 1500000,
            "type": "rent",
            "beds": 0,
            "landmark": "Onitsha Bridge",
            "lat": 6.1452,
            "lng": 6.7751,
            "img": "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0",
        },
        # --- ENUGU ---
        {
            "name": "Independence Layout Duplex",
            "cat_name": "Duplex",
            "area": "Independence Layout",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Rangers Avenue",
            "price": 5500000,
            "type": "rent",
            "beds": 4,
            "landmark": "Government House",
            "lat": 6.4306,
            "lng": 7.5258,
            "img": "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
        },
        {
            "name": "New Haven 3-Bed Flat",
            "cat_name": "Apartment",
            "area": "New Haven",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Chime Avenue",
            "price": 2000000,
            "type": "rent",
            "beds": 3,
            "landmark": "Hotel Presidential",
            "lat": 6.4461,
            "lng": 7.5181,
            "img": "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        },
        {
            "name": "Trans-Ekulu Modern Villa",
            "cat_name": "Detached / Semi-Detached", # Changed from Villa
            "area": "Trans-Ekulu",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Damija Estate",
            "price": 4500000,
            "type": "rent",
            "beds": 4,
            "landmark": "82 Division",
            "lat": 6.4750,
            "lng": 7.5300,
            "img": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        },
        {
            "name": "GRA Smart Apartment",
            "cat_name": "Serviced Apartment / Condo",
            "area": "GRA",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Polo Park View",
            "price": 3000000,
            "type": "rent",
            "beds": 2,
            "landmark": "Polo Park Mall",
            "lat": 6.4582,
            "lng": 7.5061,
            "img": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        },
        {
            "name": "Golf Estate Luxury Home",
            "cat_name": "Detached / Semi-Detached",
            "area": "GRA",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Golf Course View",
            "price": 9000000,
            "type": "rent",
            "beds": 5,
            "landmark": "Golf Course",
            "lat": 6.4590,
            "lng": 7.5070,
            "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        },
        {
            "name": "Emene Industrial Site",
            "cat_name": "Warehouse / Industrial Space",
            "area": "Emene",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Airport Road",
            "price": 15000000,
            "type": "rent",
            "beds": 0,
            "landmark": "Enugu Airport",
            "lat": 6.4722,
            "lng": 7.5841,
            "img": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
        },
        {
            "name": "Uwani Retail Shop",
            "cat_name": "Shop / Store",
            "area": "Uwani",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Zik Avenue",
            "price": 400000,
            "type": "rent",
            "beds": 0,
            "landmark": "Roban Stores",
            "lat": 6.4194,
            "lng": 7.5025,
            "img": "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0",
        },
        {
            "name": "Aguda Shortlet Studio",
            "cat_name": "Self-Contained / Studio / Mini-Flat",
            "area": "Surulere",
            "city": "Lagos",
            "state": "Lagos",
            "address": "Aguda, Surulere",
            "price": 2500000,
            "type": "rent",
            "beds": 1,
            "landmark": "National Stadium",
            "lat": 6.4975,
            "lng": 3.3421,
            "img": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        },
        {
            "name": "The Banana Island Sanctuary",
            "cat_name": "Detached / Semi-Detached", # Changed from Mansion
            "area": "Banana Island",
            "city": "Lagos",
            "state": "Lagos",
            "address": "Zone 4, Banana Island Estate",
            "price": 45000000,
            "type": "rent",
            "beds": 7,
            "landmark": "Lagos Lagoon",
            "lat": 6.4667,
            "lng": 3.4500,
            "img": "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
            "gallery": [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                "https://images.unsplash.com/photo-1600607687940-c52af04657b3",
                "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
                "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
                "https://images.unsplash.com/photo-1600585154542-6379b17440fd",
                "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2",
                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"
            ]
        },
        {
            "name": "Centenary City Smart Villa",
            "cat_name": "Detached / Semi-Detached", # Changed from Villa
            "area": "Kuje",
            "city": "Abuja",
            "state": "FCT",
            "address": "Plot 44, Centenary City",
            "price": 18000000,
            "type": "rent",
            "beds": 5,
            "landmark": "Nnamdi Azikiwe Int'l Airport",
            "lat": 8.9950,
            "lng": 7.2210,
            "img": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
            "gallery": [
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
                "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
                "https://images.unsplash.com/photo-1449844908441-8829872d2607",
                "https://images.unsplash.com/photo-1416331108676-a22ccb276e35",
                "https://images.unsplash.com/photo-1505843513577-22bb7d21ef45",
                "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
                "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c",
                "https://images.unsplash.com/photo-1494526585095-c41746248156",
                "https://images.unsplash.com/photo-1464146072230-91cabc968266"
            ]
        },
        {
            "name": "The Heritage Penthouse",
            "cat_name": "Apartment", # Changed from Penthouse
            "area": "Independence Layout",
            "city": "Enugu",
            "state": "Enugu",
            "address": "Block B, Heritage Estates",
            "price": 12000000,
            "type": "rent",
            "beds": 4,
            "landmark": "Polo Park View",
            "lat": 6.4350,
            "lng": 7.5100,
            "img": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
            "gallery": [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
                "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
                "https://images.unsplash.com/photo-1507089947368-19c1da97753e",
                "https://images.unsplash.com/photo-1560448204-61dc36dc98c8",
                "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
                "https://images.unsplash.com/photo-1560185893-a55caf0a5289",
                "https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa"
            ]
        }
    ]

    for index, p in enumerate(property_templates):
        # 2. Assign landlord in a round-robin fashion
        assigned_landlord_id = landlord_ids[index % len(landlord_ids)]

        exists = (
            session.query(Property)
            .filter_by(name=p["name"], address=p["address"])
            .first()
        )
        if exists:
            continue

        category = session.query(Category).filter_by(name=p["cat_name"]).first()
        if not category:
            continue

        property_gallery = p.get("gallery", [p["img"]])

        new_prop = Property(
            name=p["name"],
            description=f"Modern {p['name']} with premium amenities near {p['landmark']}.",
            listing_type=p["type"],
            bedrooms=p["beds"],
            bathrooms=max(1, p["beds"]),
            toilets=p["beds"] + 1,
            kitchens=1 if p["beds"] > 0 else 0,
            floors_no=(
                2 if any(x in p["name"] for x in ["Duplex", "Villa", "Mansion"]) else 1
            ),
            size_sqft=float(random.randint(1800, 5000)),
            year_built=2023,
            furnished="semi",
            water_source="borehole",
            address=p["address"],
            street=p["address"],
            area=p["area"],
            city=p["city"],
            state=p["state"],
            zipcode=400102.0,
            latitude=p["lat"],
            longitude=p["lng"],
            closest_landmark=p["landmark"],
            payment_structure="yearly",
            rent_amount=p["price"],
            caution_fee=int(p["price"] * 0.1),
            agreement_fee=int(p["price"] * 0.05),
            available_from=datetime.today(),
            minimum_lease_duration="1 year",
            cover_image=p["img"],
            gallery=property_gallery,
            # Use the dynamically assigned landlord ID
            landlord_id=assigned_landlord_id,
            category_id=category.id,
            status="available",
            is_available=True,
        )
        session.add(new_prop)

    try:
        session.commit()
        print(
            f"Successfully distributed 20 properties among {len(landlord_ids)} landlords!"
        )
    except Exception as e:
        session.rollback()
        print(f"Error seeding properties: {e}")


def seed_users(session):
    from app.models import UserIdentityDocument, LandlordInfo, TenantInfo

    # 1. Define the password and hash it correctly
    raw_password = "password123"
    # Convert string to bytes
    password_bytes = raw_password.encode("utf-8")
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed_pw_bytes = bcrypt.hashpw(password_bytes, salt)
    # 2. Decode bytes to string for database storage
    hashed_pw_str = hashed_pw_bytes.decode("utf-8")

    users_to_seed = [
        {
            "firstName": "Chinedu",
            "lastName": "Landlord",
            "email": "landlord@kedusoft.com",
            "role": "landlord",
            "is_verified": True,
            "is_email_verified": True,
            "identity_documents": [
                {
                    "type": "national_id",
                    "url": "http://example.com/id.jpg",
                    "verified": True,
                }
            ],
            "landlord_info": {
                "verification_status": "approved",
            },
        },
        {
            "firstName": "Amaka",
            "lastName": "Tenant",
            "email": "tenant@kedusoft.com",
            "role": "tenant",
            "is_verified": True,
            "is_email_verified": True,
            "identity_documents": [
                {
                    "type": "passport",
                    "url": "http://example.com/pp.jpg",
                    "verified": True,
                }
            ],
            "tenant_info": {
                "verification_status": "approved",
                "total_monthly_income": 1500000,
            },
        },
    ]

    for user_data in users_to_seed:
        exists = session.query(User).filter_by(email=user_data["email"]).first()
        if not exists:
            new_user = User(
                id=str(uuid.uuid4()),
                firstName=user_data["firstName"],
                lastName=user_data["lastName"],
                email=user_data["email"],
                role=user_data["role"],
                password=hashed_pw_str,  # Standard for seeding
                is_active=True,
                is_verified=user_data["is_verified"],
                is_email_verified=user_data["is_email_verified"],
                joined_at=datetime.datetime.utcnow(),
            )

            # Add identity documents
            for doc in user_data.get("identity_documents", []):
                identity_doc = UserIdentityDocument(
                    user_id=new_user.id,
                    document_type=doc["type"],
                    document_url=doc["url"],
                    is_verified=doc.get("verified", False),
                )
                new_user.identity_documents.append(identity_doc)

            # Set Role Specific Data
            if user_data["role"] == "landlord":
                landlord_info_data = user_data.get("landlord_info", {})
                landlord_info = LandlordInfo(
                    user_id=new_user.id,
                    verification_status=landlord_info_data.get(
                        "verification_status", "not_started"
                    ),
                )
                new_user.landlord_info = landlord_info
            else:
                tenant_info_data = user_data.get("tenant_info", {})
                tenant_info = TenantInfo(
                    user_id=new_user.id,
                    verification_status=tenant_info_data.get(
                        "verification_status", "not_started"
                    ),
                    total_monthly_income=tenant_info_data.get("total_monthly_income"),
                )
                new_user.tenant_info = tenant_info

            session.add(new_user)

    try:
        session.commit()
        print("✅ Seeded Admin Landlord and Tenant successfully!")
    except Exception as e:
        session.rollback()
        print(f"❌ Error seeding users: {e}")


def generate_pdf(template_path, filename, **kwargs):
    # kwargs allows you to pass any data (applicant, property, etc.)
    html_content = render_template(template_path, now=datetime.now(), **kwargs)

    # Generate PDF in memory
    pdf_file = HTML(string=html_content).write_pdf()

    response = make_response(pdf_file)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = f'attachment; filename="{filename}.pdf"'
    return response