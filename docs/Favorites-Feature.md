NeedHomes — Favorites Feature Frontend Integration Guide
Base URL: {{API_BASE_URL}}
All endpoints require: Authorization: Bearer <user_jwt>
Overview
Users can save properties to a personal favorites list. Adding a property to favorites sends an in-app notification and a push notification to the user's device automatically.
Endpoints
1. Add Property to Favorites
POST /favorites/:propertyId
Adds a property to the authenticated user's favorites list.
Headers:
Authorization: Bearer <user_jwt>
Response — 201 Success:
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "message": "\"Lekki Phase 1 Plot\" added to your favorites"
  }
}
Response — 409 Already favorited:
{
  "statusCode": 409,
  "message": "Property is already in your favorites"
}
Response — 404 Property not found:
{
  "statusCode": 404,
  "message": "Property not found"
}
2. Remove Property from Favorites
DELETE /favorites/:propertyId
Removes a property from the authenticated user's favorites list.
Headers:
Authorization: Bearer <user_jwt>
Response — 200 Success:
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Property removed from your favorites"
  }
}
Response — 404 Not in favorites:
{
  "statusCode": 404,
  "message": "Property not found in your favorites"
}
3. Get My Favorites (Paginated)
GET /favorites?page=1&limit=20
Returns the authenticated user's favorited properties with full property details.
Query params:
Param
Type
Default
Description
page
number
1
Page number
limit
number
20
Items per page

Response:
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "id": "favorite-uuid",
        "createdAt": "2026-05-25T10:00:00.000Z",
        "property": {
          "id": "property-uuid",
          "customId": "PROP-001",
          "propertyTitle": "Lekki Phase 1 Plot",
          "propertyType": "LAND",
          "investmentModel": "LAND_BANKING",
          "location": "Lekki, Lagos",
          "state": "Lagos",
          "coverImage": "https://cloudinary.com/...",
          "basePrice": 30000000,
          "totalPrice": 35000000,
          "availablePlots": 5,
          "pricePerPlot": 30000000,
          "developmentStage": "ONGOING",
          "premiumProperty": false
        }
      }
    ],
    "meta": {
      "total": 12,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
All price fields are in kobo — divide by 100 to display in naira.
Notification Behaviour
When a user adds a property to favorites the backend automatically fires:
Channel
Content
In-app notification
"Lekki Phase 1 Plot" has been added to your favorites.
Push notification
Same message — delivered to the user's registered device token

No notification is sent on removal.
Implementing the Favorite Toggle Button
async function toggleFavorite(propertyId, isCurrentlyFavorited) {
  if (isCurrentlyFavorited) {
    await api.delete(`/favorites/${propertyId}`);
    return false; // now unfavorited
  } else {
    await api.post(`/favorites/${propertyId}`);
    return true; // now favorited
  }
}
Managing isFavorited State
The favorites list endpoint returns which properties are favorited. Load it once on app start and maintain a local Set for instant UI feedback:
// On app load — fetch all favorited property IDs
async function loadFavoriteIds() {
  let allIds = new Set();
  let page = 1;
  while (true) {
    const res = await api.get(`/favorites?page=${page}&limit=100`);
    const { data, meta } = res.data.data;
    data.forEach(fav => allIds.add(fav.property.id));
    if (page >= meta.totalPages) break;
    page++;
  }
  return allIds;
}
// Check if a property is favorited
function isFavorited(propertyId, favoriteIds) {
  return favoriteIds.has(propertyId);
}
React example:
const [favoriteIds, setFavoriteIds] = useState(new Set());
const handleToggle = async (propertyId) => {
  const alreadyFav = favoriteIds.has(propertyId);
  try {
    if (alreadyFav) {
      await api.delete(`/favorites/${propertyId}`);
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(propertyId); return s; });
    } else {
      await api.post(`/favorites/${propertyId}`);
      setFavoriteIds(prev => new Set(prev).add(propertyId));
    }
  } catch (err) {
    if (err.response?.status === 409) {
      // Already favorited — sync local state
      setFavoriteIds(prev => new Set(prev).add(propertyId));
    }
  }
};
Error Reference
Status
Message
Cause
401
Unauthorized
Missing or expired JWT
403
Forbidden
User role lacks permission
404
Property not found
Invalid propertyId
404
Property not found in your favorites
Trying to remove something not favorited
409
Property is already in your favorites
Duplicate add attempt
