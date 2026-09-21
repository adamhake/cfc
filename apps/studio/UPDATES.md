# Publishing park updates

Use **Updates** for seasonal news, construction progress, temporary access or
road closures, and other news relevant to park visitors. Use **Events** for
scheduled gatherings and **Projects** for ongoing initiatives; an update can
link to either.

1. Open **Updates** in Studio and create a document.
2. Add a title, generate its slug in **Settings**, and write a short description
   (up to 200 characters). These are required, along with the publication date.
3. Optionally add rich text, links, images, and downloadable files in the body.
   A hero image is optional; a short notice can consist of just its summary.
4. Choose a category. Manage these under **Update Categories**; examples are
   Seasonal Updates, Construction, and Park Access.
5. For a temporary notice, optionally set **End Date** to its last applicable day.
   The site labels it “Ended” starting the following day in Richmond time. It
   remains published and readable; an end date does not unpublish the article.
6. Use **Relationships** to select related events and projects. Those pages also
   display the update automatically.
7. Set **Featured Update** to prioritize it on the homepage and updates listing.
   The homepage shows up to three updates, filling unused featured slots with
   the newest articles. Ended articles can still be featured; turn off Featured
   when you no longer want to prioritize one.
8. Preview and publish. The publication date controls the displayed date and
   ordering; changing it does not schedule publication.

**Updates Page** controls the listing hero and introduction. Categories filter
at `/updates?category=category-slug`; article links are `/updates/article-slug`.
Older articles remain accessible through the listing, category filters, related
pages, and older/newer article links.

Existing updates need no migration: missing end dates mean the article has no
end date. No new environment variables are required.
