from geopy.distance import geodesic


def filter_by_distance(
    doctors: list[dict],
    lat: float,
    lng: float,
    radius_km: float = 10.0
) -> list[dict]:
    """
    Filter and sort doctors by distance from patient location.
    Doctors without coordinates are included at the end with distance=None.
    """
    patient_coords = (lat, lng)
    with_coords = []
    without_coords = []

    for d in doctors:
        if d.get("clinic_lat") and d.get("clinic_lng"):
            try:
                dist = geodesic(patient_coords, (d["clinic_lat"], d["clinic_lng"])).km
                if dist <= radius_km:
                    d["distance_km"] = round(dist, 1)
                    with_coords.append(d)
            except Exception:
                d["distance_km"] = None
                without_coords.append(d)
        else:
            d["distance_km"] = None
            without_coords.append(d)

    # Sort by distance, then append those without location
    with_coords.sort(key=lambda x: x["distance_km"])
    return with_coords + without_coords


def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance in km between two coordinates"""
    return round(geodesic((lat1, lng1), (lat2, lng2)).km, 1)
