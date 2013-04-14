
import urllib2
import json


site = 'http://openstreetmap.ru'


# format: 
#   slat slon lat lon q
tests = 'test_search2.txt'

fault_lat = 0.0007
fault_lon = 0.0012

noFoundScores = 30


def check_result(result, slat, slon):
	if result['find'] != True: return [False, noFoundScores]
	n = 0
	for res in result['matches']:
		n += 1
		rlat = float(res['lat'])
		rlon = float(res['lon'])
		if ((slat-fault_lat < rlat and slat+fault_lat > rlat) or (slat+fault_lat < rlat and slat-fault_lat > rlat)) and ((slon-fault_lon < rlon and slon+fault_lon > rlon) or (slon+fault_lon < rlon and slon-fault_lon > rlon)): return [True, n]
	return [False, noFoundScores]

sum = {'n':0, 'true':0, 'false':0, 'total_scores':0, 'scores':{}}

for l in open(tests).xreadlines():
	sum['n'] += 1
	slat, slon, lat, lon, q = l.strip('\n').split(' ', 4)
	
	q0 = q.replace(' ', '+')
	url = '%s/api/search?q=%s&lat=%s&lon=%s' %(site, q0, lat, lon)
	json_data = urllib2.urlopen(url).read()
	data = json.loads(json_data)
	print q,
	res = check_result(data, float(slat), float(slon))
	sum['total_scores'] += res[1]
	if res[1] in sum['scores']:
		sum['scores'][res[1]] += 1
	else:
		sum['scores'][res[1]] = 1
  
	if res[0]:
		print ' OK ' + str(res[1])
		sum['true'] += 1
	else:
		print ' FAIL ' + str(res[1])
		sum['false'] += 1

print 'sum:', str(sum)
