import csv
import pandas as pd

def title_genre(path):
    x, y = [], []
    genre_map = {}
    df = pd.read_csv(path)
    genre_list = df['listed_in'].values
    titles = df['title'].values
    total_genres = 0

    for i in range(len(titles)):
        genres = genre_list[i]
        if ',' not in genres:
            genres = [genres]
        else:
            genres = genres.split(',')
        total_genres += len(genres)
        for j in range(len(genres)):
            genre = genres[j].lstrip()
            if genre in genre_map:
                genre_map[genre] += 1
            else:
                genre_map[genre] = 1
    for key in genre_map:
        x.append(key)
        y.append(genre_map[key])
    
    with open('data/title_genre.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['genre', 'titles_per_genre', 'percent'])
        for i in range(len(x)):
            percent = float(y[i]) / float(total_genres)
            writer.writerow([x[i], y[i], percent])


def runtime_release_year(path):
    df = pd.read_csv(path)
    runtimes = df['duration'].values
    release_years = df['release_year'].values
    types = df['type'].values
    runtimes_years = {}
    for i in range(len(release_years)):
        if types[i] != "Movie":
            continue
        runtime = int(runtimes[i].split(" ")[0])
        # TODO: CONVERT SECONDS TO MINUTES, HOURS TO MINUTES
        year = release_years[i]
        if year not in runtimes_years:
            runtimes_years[year] = [runtime]
        else:
            runtimes_years[year].append(runtime)
    years = []
    avg_runtimes = []
    for y in runtimes_years:
        runtimes = runtimes_years[y]
        avg = float(sum(runtimes)) / float(len(runtimes))
        avg = round(avg, 2)
        years.append(y)
        avg_runtimes.append(avg)
    with open('data/runtime_years.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['year', 'avg_time'])
        for i in range(len(years)):
            writer.writerow([years[i], avg_runtimes[i]])


def top_actor_directors(path):
    df = pd.read_csv(path)
    director_list = df['director'].values
    actors_list = df['cast'].values
    types = df['type'].values
    N = len(director_list)
    ad_map = {}
    for i in range(N):
        directors = director_list[i]
        if types[i] != "Movie" or directors != directors:
            continue
        if ',' not in directors:
            directors = [directors]
        else:
            directors = directors.split(',')
        for director in directors:
            director = director.lstrip()
            actors = actors_list[i]
            # checking for NaN type
            if actors != actors:
                actors = []
            elif ',' not in actors:
                actors = [actors]
            else:
                actors = actors.split(',')
            for actor in actors:
                actor = actor.lstrip()
                if (director, actor) not in ad_map:
                    ad_map[(director, actor)] = 1
                else:
                    ad_map[(director, actor)] += 1
    
    with open('data/actor_director.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['director_actor', 'movie_count'])
        for k in ad_map:
            print(k)
            d = k[0]
            a = k[1]
            director_actor = d + "/" + a
            movie_count = ad_map[k]
            writer.writerow([director_actor, movie_count])
            




title_genre('data/netflix.csv')
runtime_release_year('data/netflix.csv')
top_actor_directors('data/netflix.csv')
